import React, { Component } from "react";
import { Page, AcInput, AcDatePciker, AcTextArea, AcButton, AcToggle, AcLoader } from "../../components";
import { FormInput, UpdateProjectModel, EventType } from "../../types";
import { Autobind } from "../../helpers";

import "./EditProject.page.scss";
import { LoadingService, ProjectService, ToastService } from "../../services";
import { Redirect } from "react-router";
import { Project } from "../../models";

interface DirectionInternal {
  DirectionTitle: FormInput;
  DirectionDescription: FormInput;
}

interface FormFields {
  projectTitle: FormInput;
  projectDescription: FormInput;
  proposeStartDate: FormInput;
  proposeEndDate: FormInput;
  voteStartDate: FormInput;
  voteEndDate: FormInput;
  isProjectActive: FormInput;
}

interface Props {
  match: any;
}

interface State {
  isFormValid: boolean;
  formState: FormFields;
  redirect: boolean;
  project?: Project;
  directions: DirectionInternal[];
}

export class EditProject extends Component<Props, State> {
  private loadingService: LoadingService;
  private projectService: ProjectService;
  private toastService: ToastService;
  public state: State = {
    isFormValid: true,
    directions: [],
    formState: {
      projectTitle: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      projectDescription: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      proposeStartDate: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      proposeEndDate: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      voteStartDate: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      voteEndDate: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      isProjectActive: {
        valid: true,
        validationFunctions: [],
        value: ''
      },
    },
    redirect: false
  }

  public constructor(props: any) {
    super(props);
    this.loadingService = LoadingService.instance;
    this.projectService = ProjectService.instance;
    this.toastService = ToastService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.projectService.getProjectById(this.props.match.params.id).then((project: any) => {
      this.setState({ project: project }, () => {
        this.setState({
          formState: {
            projectTitle: { ...this.state.formState.projectTitle, value: this.state.project!.ProjectTitle },
            projectDescription: { ...this.state.formState.projectDescription, value: this.state.project!.ProjectDescription },
            proposeStartDate: { ...this.state.formState.proposeStartDate, value: this.state.project!.ProposeStartDate },
            proposeEndDate: { ...this.state.formState.proposeEndDate, value: this.state.project!.ProposeEndDate },
            voteStartDate: { ...this.state.formState.voteStartDate, value: this.state.project!.VoteStartDate },
            voteEndDate: { ...this.state.formState.voteEndDate, value: this.state.project!.VoteEndDate },
            isProjectActive: { ...this.state.formState.isProjectActive, value: this.state.project!.IsProjectActive },
          },
         directions: this.state.project!.ProjectDirection.map(item => {
           const direction: DirectionInternal = {
             DirectionTitle: {
               validationFunctions: [],
               valid: true,
               value: item.DirectionTitle
             },
             DirectionDescription: {
               validationFunctions: [],
               value: item.DirectionDescription,
               valid: true,
             }
           }
           return direction;
         })
        }, () => this.loadingService.changeLoader(false))
      });
    });
  }

  public render() {
    return (
      <Page title="Редактировать проект">
        <AcLoader>
          <div className="edit-project">
            <div className="wrapper">
              <AcInput
                inputType="text"
                label="Название проекта"
                onChange={(value, isValid) => this.inputChange("projectTitle", value, isValid)}
                formInput={this.state.formState.projectTitle}
              />
              <AcTextArea
                label="Описание проекта"
                onChange={(value, isValid) => this.inputChange("projectDescription", value, isValid)}
                formInput={this.state.formState.projectDescription}
                withHint={true}
                hintText="Форматирование будет сохранено"
              />

              <h4>Фаза подачи идей</h4>
              <div className="dates-group">
                <AcDatePciker
                  label=""
                  formInput={this.state.formState.proposeStartDate}
                  onChange={(value) => this.inputChange("proposeStartDate", value, true)}
                  minDate={new Date()}
                  maxDate={this.state.formState.proposeEndDate.value}
                />
                <AcDatePciker
                  label=""
                  formInput={this.state.formState.proposeEndDate}
                  onChange={(value) => this.inputChange("proposeEndDate", value, true)}
                  minDate={this.state.formState.proposeStartDate.value}
                  maxDate={this.state.formState.voteStartDate.value}
                />
              </div>

              <h4>Фаза голосования</h4>
              <div className="dates-group">
                <AcDatePciker
                  label=""
                  formInput={this.state.formState.voteStartDate}
                  onChange={(value) => this.inputChange("voteStartDate", value, true)}
                  minDate={this.state.formState.proposeEndDate.value}  
                  maxDate={this.state.formState.voteEndDate.value}  
                />
                <AcDatePciker
                  label=""
                  formInput={this.state.formState.voteEndDate}
                  onChange={(value) => this.inputChange("voteEndDate", value, true)}
                  minDate={this.state.formState.proposeEndDate.value}  
                />
              </div>
              <AcToggle
                title="Активный проект"
                formInput={this.state.formState!.isProjectActive}
                onChange={(value) => this.inputChange("isProjectActive", value, true)}
              />
              <div className="directions-block">
              <AcButton 
                title="Добавить направление"
                type="positive"
                onClick={this.addDirection}
              />
              {this.state.directions.map((item, index) => (
                <div className="direction" key={index}>
                  <AcInput 
                    label="Название направления"
                    inputType="text"
                    formInput={item.DirectionTitle}
                    onChange={(value) => this.directionChange("DirectionTitle", value, index)}
                  />
                  <AcTextArea 
                    label="Описание направления"
                    formInput={item.DirectionDescription}
                    onChange={(value) => this.directionChange("DirectionDescription", value, index)}
                  />
                  <AcButton 
                    title="Удалить"
                    type="negative"
                    onClick={() => this.deleteDirection(index)}
                  />
                </div>
              ))}
             </div>
              <AcButton title="Сохранить" type="primary" onClick={this.updateProject}/>
            </div>
          </div>
        </AcLoader>
        { this.state.redirect ? <Redirect to={`/current-projects/${this.state.project!.Id}`}/> : "" }
      </Page>
    )
  }

  @Autobind
  private inputChange(formFiled: keyof FormFields, value: any, isValid: boolean) {
    this.setState({
      formState: {
        ...this.state.formState,
        [formFiled]: { ...this.state.formState[formFiled], value, valid: isValid},
      },
    });
  }

  @Autobind
  private directionChange(filed: keyof DirectionInternal, value: any, index: number) {
    this.setState({
      directions: this.state.directions.map((item, i) => i === index ? { ...item, [filed]: { ...item[filed], value } } : item)
    });
  }
  
  @Autobind
  private addDirection() {
    const direction: DirectionInternal = {
      DirectionTitle: {
        valid: true,
        validationFunctions: [],
        value: '',
      },
      DirectionDescription: {
        valid: true,
        validationFunctions: [],
        value: '',
      }
    }
    this.setState({ directions: [...this.state.directions, direction ]});
  }

  @Autobind
  private deleteDirection(index: number) {
    this.setState({ directions: this.state.directions.filter((item, i) => i !== index )});
  }
  
  
  @Autobind
  private updateProject() {
    const model: UpdateProjectModel = {
      Id: +this.state.project!.Id,
      ProjectTitle: this.state.formState.projectTitle.value,
      ProjectDescription: this.state.formState.projectDescription.value,
      ProposeStartDate: +this.state.formState.proposeStartDate.value,
      ProposeEndDate: +this.state.formState.proposeEndDate.value,
      VoteStartDate: + this.state.formState.voteStartDate.value,
      VoteEndDate: +this.state.formState.voteEndDate.value,
      IsProjectActive: this.state.formState.isProjectActive.value,
      ProjectImage: this.state.project!.ProjectImage,
      ProjectDirection: this.state.directions.map((item, index) => {
        return {
          ...this.state.project!.ProjectDirection[index],
          DirectionTitle: item.DirectionTitle.value,
          DirectionDescription: item.DirectionDescription.value
        };
      })
    }

    this.loadingService.changeLoader(true);
    this.projectService.updateProject(model).then(() => {
      this.loadingService.changeLoader(false);
      this.setState({ redirect: true });
      this.toastService.changeEvent({ message: "Проект отредактирован", type: EventType.Success, show: true });
    }, () => {
      this.loadingService.changeLoader(false);
      this.toastService.changeEvent({ message: "Внесите изменения. Проект не сохранён", type: EventType.Error, show: true });
    });
  }
}
