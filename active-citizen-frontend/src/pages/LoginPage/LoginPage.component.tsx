import React, { Component } from "react";
import { Page, AcInput, AcButton, AcLoader } from "../../components";
import { RouteComponentProps } from "react-router";
import { FormInput, SiginModel } from "../../types";
import { requireValidationFunction, emailValidationFunction, passwordValidationFunction } from "../../constants";
import { Autobind } from "../../helpers";
import { UserService, LoadingService } from "../../services";

import "./LoginPage.component.scss";
import { RouterService } from "../../services/Router.service";
import { Link } from "react-router-dom";

interface Props extends RouteComponentProps<any> {}

interface FormFields {
  email: FormInput;
  password: FormInput;
}

interface State {
  isFormValid: boolean;
  formState: FormFields;
}

export class LoginPage extends Component<Props, State> {
  private userService: UserService;
  private loadingService: LoadingService;
  private routerService: RouterService;

  public state: State = {
    isFormValid: false,
    formState: {
      email: {
        value: '',
        validationFunctions: [requireValidationFunction, emailValidationFunction],
        valid: false,
      },
      password: {
        value: '',
        validationFunctions: [requireValidationFunction, passwordValidationFunction],
        valid: false,
      }
    }
  }

  public constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
    this.loadingService = LoadingService.instance;
    this.routerService = RouterService.instance;
  }

  public render() {
    return (
      <Page title="Вход" width="440">
        <AcLoader>
          <div className="signin-wrapper">
            <div>
              <AcInput inputType="text"
                label="Адрес электронной почты"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("email", value, isValid)}
                formInput={this.state.formState.email}
              />
              <AcInput inputType="password"
                label="Пароль"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("password", value, isValid)}
                formInput={this.state.formState.password}
              />
              <div className="hint">
                *-поля, обязательные для заполнения
              </div>
                <div className="button-container">
                  <AcButton title="Войти"
                    type="primary"
                    onClick={this.signin}
                    disabled={!this.state.isFormValid}/>
                  <Link to="/request-reset">
                    <span className="link">Забыли пароль?</span>
                  </Link>
                </div>
              </div>
          </div>
        </AcLoader>
      </Page>
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
      isFormValid: valid
    });
  }

  @Autobind
  private signin() {
    const model: SiginModel = {
      Email:  this.state.formState.email.value,
      Password: this.state.formState.password.value,
    }

    this.loadingService.changeLoader(true);
    this.userService.signin(model).then(() => {
      this.loadingService.changeLoader(false);
      this.routerService.redirect("/");
    }, () => {
      this.loadingService.changeLoader(false);
    });
  }
}