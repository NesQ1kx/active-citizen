import React, { Component } from "react";

import "./ProposeIdeaModal.component.scss";
import { AcInput, AcTextArea, AcButton } from "../common";
import { FormInput } from "../../types";
import { requireValidationFunction } from "../../constants";
import { Autobind } from "../../helpers";

interface FormFields {
  ideaTitle: FormInput;
  ideaDescription: FormInput
}

interface Props {
  onConfirm?: (idea: any) => void;
}

interface State {
  formState: FormFields;
  isFormValid: boolean;
}

export class ProposeIdeaModal extends Component<Props, State> {
  public state: State = {
    isFormValid: false,
    formState: {
      ideaTitle: {
        value: '',
        valid: false,
        validationFunctions: [requireValidationFunction],
      },
      ideaDescription: {
        value: '',
        valid: false,
        validationFunctions: [requireValidationFunction],
      }
    }
  }

  public render() {
    return (
      <div className="propose-modal">
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

        <div className="modal-footer">
          <AcButton
            title="Отправить"
            type="primary"
            disabled={!this.state.isFormValid}
            onClick={this.handleConfirm}
          />
        </div>
      </div>

    )
  }

  @Autobind
  private inputChange(formFiled: keyof FormFields, value: any, isValid: boolean) {
    let isFormValid;
    this.setState({
      formState: {
        ...this.state.formState,
        [formFiled]: { ...this.state.formState[formFiled], value, valid: isValid},
      },
    }, () => isFormValid = this.validateForm());
  }

  @Autobind
  private validateForm() {
    let valid = Object.keys(this.state.formState).every((field: any) => {
      let input = field as keyof FormFields;
      return this.state.formState[input].valid;
    });
    this.setState({
      isFormValid: valid,
    });
  }

  @Autobind
  private handleConfirm() {
    this.props.onConfirm && this.props.onConfirm(
      {
        title: this.state.formState.ideaTitle.value,
        description: this.state.formState.ideaDescription.value
      });
  }
}