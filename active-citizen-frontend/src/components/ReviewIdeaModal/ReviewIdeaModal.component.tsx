import React, { Component } from "react";

import "./ReviewIdeaModal.component.scss"
import { DirectionIdea } from "../../models";
import { FormInput, EventType } from "../../types";
import { requireValidationFunction } from "../../constants";
import { AcInput, AcTextArea } from "..";
import { Autobind } from "../../helpers";
import { AcRadio, AcButton } from "../common";
import { ProjectService, ToastService } from "../../services";

const reasonToCode: any = {
  reason1: 1,
  reason2: 2,
  reason3: 3,
  reason4: 4,
}

interface FormFields {
  ideaTitle: FormInput;
  ideaDescription: FormInput;
}

interface Props {
  idea: DirectionIdea;
  onConfirm: () => void;
}

interface State {
  formState: FormFields;
  isFormValid: boolean;
  accepted: boolean;
  rejected: boolean;
  reason1: boolean;
  reason2: boolean;
  reason3: boolean;
  reason4: boolean;
}


export class ReviewIdeaModal extends Component<Props, State> {
  private projectService: ProjectService;
  private toastService: ToastService;
  public state: any = {
    isFormValid: false,
    accepted: false,
    rejected: false,
    reason1: false,
    reason2: false,
    reason3: false,
    reason4: false,
    formState: {
      ideaTitle: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
      ideaDescription: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
    }
  }

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.toastService = ToastService.instance;
  }

  public componentDidMount() {
    this.setState({
      formState: {
        ...this.state.formState,
        ideaTitle: { ...this.state.formState.ideaTitle, value: this.props.idea.IdeaTitle, valid: true },
        ideaDescription: { ...this.state.formState.ideaDescription, value: this.props.idea.IdeaDescription, valid: true  },
      }
    }, () => this.validateForm());
  }

  public render() {
    return (
      <div className="review-modal">
        <AcInput 
          label="Краткое название идеи"
          inputType="text"
          formInput={this.state.formState.ideaTitle}
          isRequired={true}
          onChange={(value, isValid) => this.inputChange("ideaTitle", value, isValid)}
        />
        <AcTextArea 
          label="Описание идеи"
          formInput={this.state.formState.ideaDescription}
          isRequired={true}
          onChange={(value, isValid) => this.inputChange("ideaDescription", value, isValid)}
        />
        <i>
          Внимательно ознакомьтесь с идеей. Убедитесь что, соблюдены все правила, и идея соответсвует теме проекта.
        </i>
        <div className="idea-dcision">
          <div>
            <AcRadio
              name="rejectConfrim"
              label="Принять"
              onCheck={() => this.onRadioCheck("accepted", ["rejected"])}
            />
            <AcRadio
              name="rejectConfrim"
              label="Отклонить"
              onCheck={() => this.onRadioCheck("rejected", ["accepted"])}
            />
          </div>
          {this.state.rejected && (
            <div>
              <i style={{ marginBottom: "10px", display: "block" }}>
                Выберите причину отклонения:
              </i>
              <AcRadio
                name="rejectReason"
                label="Не соответсвует теме проекта"
                onCheck={() => this.onRadioCheck("reason1", ["reason2", "reason3", "reason4"])}
              />
              <AcRadio
                name="rejectReason"
                label="Невозможно реализовать в рамках данного проекта"
                onCheck={() => this.onRadioCheck("reason2", ["reason1", "reason3", "reason4"])}
              />
              <AcRadio
                name="rejectReason"
                label="Подобная идея уже существует"
                onCheck={() => this.onRadioCheck("reason3", ["reason1", "reason2", "reason4"])}
              />
              <AcRadio
                name="rejectReason"
                label="Нарушает другие правила"
                onCheck={() => this.onRadioCheck("reason4", ["reason1", "reason2", "reason3"])}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <AcButton
            title="Подтвердить"
            type="primary"
            disabled={!this.state.isFormValid}
            onClick={this.confirmIdea}
          />
        </div>
      </div>
    )
  }

  @Autobind
  private inputChange(formFiled: keyof FormFields, value: any, isValid: boolean) {
    this.setState({
      formState: {
        ...this.state.formState,
        [formFiled]: { ...this.state.formState[formFiled], value, valid: isValid},
      },
    }, () => this.validateForm());
  }

  @Autobind
  private onRadioCheck(fieldToCheck: string, fieldsToUnchek: string[]) {
    this.setState({ ...this.state, [fieldToCheck]: true }, () => {
      fieldsToUnchek.forEach(field => {
        this.setState({ ...this.state, [field]: false }, () => this.validateForm());
      });
    });
  }

  @Autobind
  private validateForm() {
    let valid = Object.keys(this.state.formState).every((field: any) => {
      let input = field as keyof FormFields;
      return this.state.formState[input].valid;
    });

    valid = this.state.rejected ? this.state.reason1 || this.state.reason2 : this.state.accepted || this.state.rejected;
    
    this.setState({
      isFormValid: valid,
    });
  }

  @Autobind
  private confirmIdea() {
    let rejectReason = 0;

    Object.keys(reasonToCode).forEach((reason: string) => {
        if (this.state[reason]) {
          rejectReason = reasonToCode[reason];
        }
    });
    const model: DirectionIdea = {
      Id: this.props.idea.Id,
      IdeaTitle: this.state.formState.ideaTitle.value,
      IdeaDescription: this.state.formState.ideaDescription.value,
      CreateDate: this.props.idea.CreateDate,
      DirectionId: this.props.idea.DirectionId,
      UserId: this.props.idea.UserId,
      Status: this.state.rejected ? -1 : 1,
      RejectReason: rejectReason,
      VotesCount: this.props.idea.VotesCount,
      CountOfComments: this.props.idea.CountOfComments,
      IsRealised: this.props.idea.IsRealised,
    };

    this.projectService.updateIdea(model).then(() => {
      this.toastService.changeEvent({ message: "Идея обновлена", show: true, type: EventType.Success });
      this.props.onConfirm();
    }, () => {
      this.toastService.changeEvent({ message: "Невозможно обновить идею", show: true, type: EventType.Error });
    });
  }
}