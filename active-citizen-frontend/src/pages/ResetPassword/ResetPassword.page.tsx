import React, { Component } from "react";
import { Page, AcInput, AcButton } from "../../components";
import { FormInput, EventType } from "../../types";
import { requireValidationFunction, passwordValidationFunction } from "../../constants";

import "./ResetPassword.page.scss";
import { Autobind } from "../../helpers";
import { LoadingService, ToastService, UserService, RouterService } from "../../services";

interface FormFields {
  password: FormInput;
  repeatPassword: FormInput;
}

interface Props {
  match: any;
}

interface State {
  isFormValid: boolean;
  formState: FormFields;
  isPasswordsEquals: boolean;
}

export class ResetPassword extends Component<Props, State> {
  public state: State = {
    isFormValid: false,
    isPasswordsEquals: false,
    formState: {
      password: {
        value: '',
        validationFunctions: [requireValidationFunction, passwordValidationFunction],
        valid: false,
      },
      repeatPassword: {
        value: '',
        validationFunctions: [requireValidationFunction, passwordValidationFunction],
        valid: false,
      }
    }
  }

  private loadingService: LoadingService;
  private toastService: ToastService;
  private userService: UserService;
  private routerService: RouterService;
  
  constructor(props: Props) {
    super(props)
    this.loadingService = LoadingService.instance;
    this.toastService = ToastService.instance;
    this.userService = UserService.instance;
    this.routerService = RouterService.instance;
  }

  public render() {
    return (
      <Page title="Сброс пароля" width="440">
        <div className="reset-password">
          <AcInput
            label="Пароль"
            inputType="password"
            formInput={this.state.formState.password}
            isRequired={true}
            withHint={true}
            hintText={"Пароль не может быть короче 8 символов и должен содержать латинские буквы и цифры"}
            onChange={(value, isValid) => this.inputChange("password", value, isValid)}
          />
          <AcInput
            label="Повтор пароля"
            inputType="password"
            formInput={this.state.formState.repeatPassword}
            isRequired={true}
            onChange={(value, isValid) => this.inputChange("repeatPassword", value, isValid)}
          />
          <AcButton
            title="Сохранить"
            type="primary"
            disabled={!this.state.isFormValid}
            onClick={this.resetPassword}
          />
        </div>
      </Page>
    );
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
  private validateForm() {
    let valid = Object.keys(this.state.formState).every((field: any) => {
      let input = field as keyof FormFields;
      return this.state.formState[input].valid;
    });

    const isPasswordsEquals = this.state.formState.password.value === this.state.formState.repeatPassword.value;
    this.setState({
      isFormValid: valid && isPasswordsEquals,
      isPasswordsEquals
    });
  }

  @Autobind
  private resetPassword() {
    this.loadingService.changeLoader(true);
    this.userService.resetPassword(decodeURIComponent(this.props.match.params.token), this.state.formState.password.value).then(() => {
      this.loadingService.changeLoader(false);
      this.toastService.changeEvent({ message: "Пароль успешно сброшен", type: EventType.Success, show: true });
      this.routerService.redirect("/signin");
    }, error => {
      this.toastService.changeEvent({ message: error, type: EventType.Success, show: true });
    });
  }
}