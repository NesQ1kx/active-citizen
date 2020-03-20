import React, { Component } from "react";
import { Page, AcInput, AcDatePciker, AcTextArea, AcButton, AcToggle, AcLoader } from "../../components";
import { FormInput, LoadProjectModel } from "../../types";
import { Autobind } from "../../helpers";

import "./LoadProject.page.scss";
import { LoadingService } from "../../services";

interface FormFields {
  projectTitle: FormInput;
  projectDescription: FormInput;
  proposeStartDate: FormInput;
  proposeEndDate: FormInput;
  voteStartDate: FormInput;
  voteEndDate: FormInput;
  isProjectActive: FormInput;
}

interface State {
  isFormValid: boolean;
  formState: FormFields;
}

export class LoadProject extends Component {
  private loadingService: LoadingService;
  public state: State = {
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
      }
    }
  }

  public constructor(props: any) {
    super(props);
    this.loadingService = LoadingService.instance;
  }
  public render() {
    return (
      <Page title="Загрузить проект">
        <AcLoader>
        <div className="load-project">
            <AcInput
              inputType="text"
              label="Название проекта"
              formInput={this.state.formState.projectTitle}
            />
             <AcTextArea
              label="Описание проекта"
              formInput={this.state.formState.projectDescription}  
            />

            <h4>Фаза подачи идей</h4>
            <div className="dates-group">
              <AcDatePciker
                label=""
                onChange={(value) => this.inputChange("proposeStartDate", value, true)}
                minDate={new Date()}
                maxDate={this.state.formState.proposeEndDate.value}
              />
              <AcDatePciker
                label=""
                onChange={(value) => this.inputChange("proposeEndDate", value, true)}
                minDate={this.state.formState.proposeStartDate.value}
                maxDate={this.state.formState.voteStartDate.value}
              />
            </div>

            <h4>Фаза голосования</h4>
            <div className="dates-group">
              <AcDatePciker
                label=""
                onChange={(value) => this.inputChange("voteStartDate", value, true)}
                minDate={this.state.formState.proposeEndDate.value}  
                maxDate={this.state.formState.voteEndDate.value}  
              />
              <AcDatePciker
                label=""
                onChange={(value) => this.inputChange("voteEndDate", value, true)}
                minDate={this.state.formState.proposeEndDate.value}  
              />
            </div>
            <AcToggle
              title="Активный проект"
              onChange={(value) => this.inputChange("isProjectActive", value, true)}
            />
            <AcButton title="Загрузить" isPrimary={true} onClick={this.loadProject}/>
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
    }, () => console.log(this.state));
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
      IsProjectActive: this.state.formState.isProjectActive.value
    }
    console.log(model);
  }
}