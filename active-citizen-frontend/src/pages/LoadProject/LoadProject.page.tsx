import React, { Component } from "react";
import { Page, AcInput, AcDatePciker, AcTextArea, AcButton, AcToggle, AcLoader, AcFileInput } from "../../components";
import { FormInput, LoadProjectModel } from "../../types";
import { Autobind } from "../../helpers";

import "./LoadProject.page.scss";
import { LoadingService, ProjectService } from "../../services";
import { Redirect } from "react-router";
import { RouterService } from "../../services/Router.service";

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
  projectImage: FormInput;
}

interface State {
  isFormValid: boolean;
  formState: FormFields;
  directions: DirectionInternal[];
}

export class LoadProject extends Component {
  private loadingService: LoadingService;
  private projectService: ProjectService;
  private routerService: RouterService;

  public state: State = {
    directions: [],
    isFormValid: false,
    formState: {
      projectTitle: {
        valid: false,
        validationFunctions: [],
        value: '',
      },
      projectDescription: {
        valid: false,
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
        value: false
      },
      projectImage: {
        valid: true,
        validationFunctions: [],
        value: '',
      }
    },
  }

  public constructor(props: any) {
    super(props);
    this.loadingService = LoadingService.instance;
    this.projectService = ProjectService.instance;
    this.routerService = RouterService.instance;
  }
  public render() {
    return (
      <Page title="Загрузить проект">
        <AcLoader>
          <div className="load-project">
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
                onChange={(value) => this.inputChange("isProjectActive", value, true)}
                formInput={this.state.formState.isProjectActive.value}
              />
              <AcFileInput
                formInput={this.state.formState.projectImage}
                title="Изображение для проекта"
                onChange={(value) => this.inputChange("projectImage", value, true)}
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
              <AcButton title="Загрузить" type="primary" onClick={this.loadProject}/>
            </div>
          </div>
        </AcLoader>
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
  private loadProject() {
    const model: LoadProjectModel = {
      ProjectTitle: this.state.formState.projectTitle.value,
      ProjectDescription: this.state.formState.projectDescription.value,
      ProposeStartDate: +this.state.formState.proposeStartDate.value,
      ProposeEndDate: +this.state.formState.proposeEndDate.value,
      VoteStartDate: + this.state.formState.voteStartDate.value,
      VoteEndDate: +this.state.formState.voteEndDate.value,
      IsProjectActive: this.state.formState.isProjectActive.value,
      ProjectImage: this.state.formState.projectImage.value,
      ProjectDirection: this.state.directions.map(item => ({ DirectionTitle: item.DirectionTitle.value, DirectionDescription: item.DirectionDescription.value }))
    }

    this.loadingService.changeLoader(true);
    this.projectService.loadProject(model).then(() => {
      this.loadingService.changeLoader(false);
      this.routerService.redirect("/current-projects");
    });
  }
}
