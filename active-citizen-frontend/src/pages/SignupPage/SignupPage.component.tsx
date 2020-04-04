import React, { Component } from "react";
import { Page, AcInput, AcDropDown, AcButton, AcLoader } from "../../components";
import { Autobind } from "../../helpers";
import {  requireValidationFunction, emailValidationFunction, passwordValidationFunction, snilsValidationFunction } from "../../constants";
import { districts, sex } from "./Constants";
import { FormInput, SignupModel } from "../../types";
import { UserService, LoadingService } from "../../services";
import { RouteComponentProps, Redirect } from "react-router";


import "./SignupPage.component.scss";


interface Props extends RouteComponentProps<any> {}
interface FormFields {
  firstName: FormInput;
  lastName: FormInput;
  patronym: FormInput;
  email: FormInput;
  snils: FormInput;
  district: FormInput;
  sex: FormInput;
  password: FormInput;
  passwordRepeat: FormInput; 
}

interface State {
  isPasswordEquals: boolean;
  isFormValid: boolean;
  formState: FormFields;
  redirect: boolean;
}

export class SignupPage extends Component<Props, State> {
  private loadingService: LoadingService;
  private userService: UserService;
  public state: State = {
    redirect: false,
    isPasswordEquals: true,
    isFormValid: false,
    formState: {
      district:  {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: true,
      },
      firstName: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
      lastName: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
      patronym: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
      sex: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: true,
      },
      snils:  {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
      password: {
        value: '',
        validationFunctions: [requireValidationFunction, passwordValidationFunction],
        valid: false,
      },
      passwordRepeat: {
        value: '',
        validationFunctions: [requireValidationFunction, passwordValidationFunction],
        valid: false,
      },
      email: {
        value: '',
        validationFunctions: [requireValidationFunction, emailValidationFunction],
        valid: false,
      },
    }
  }
  
  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance; 
    this.loadingService = LoadingService.instance;
  }
  public render() {
    return (
      <Page title="Регистрация пользователя">
        <AcLoader>
          <div className="signup-wrapper">
            <div>
              <AcInput inputType="text"
                label="Фамилия"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("lastName", value, isValid)}
                formInput={this.state.formState.lastName}
              />
              <AcInput inputType="text"
                label="Имя"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("firstName", value, isValid)}
                formInput={this.state.formState.firstName}
              />
              <AcInput inputType="text"
                label="Отчество"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("patronym", value, isValid)}
                formInput={this.state.formState.patronym}
              />
              <AcInput inputType="text"
                label="Адрес электронной почты"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("email", value, isValid)}
                formInput={this.state.formState.email}
              />
              <AcInput inputType="text"
                label="СНИЛС"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("snils", value, isValid)}
                formInput={this.state.formState.snils}
              />
            </div>
            <div>
              <AcDropDown label="Район проживания"
                list={districts}
                isRequired={true}
                onChange={(value) => this.inputChange("district", value, true)}
              />
              <AcDropDown list={sex}
                label="Пол"
                isRequired={true}
                onChange={(value) => this.inputChange("sex", value, true)}
              />
              <AcInput inputType="password"
                label="Пароль"
                isRequired={true}
                withHint={true}
                hintText={"Пароль не может быть короче 8 символов и должен содержать латинские буквы и цифры"}
                onChange={(value, isValid) => this.inputChange("password", value, isValid)}
                formInput={this.state.formState.password}

              />
              <AcInput inputType="password"
                label="Повторите пароль"
                isRequired={true}
                onChange={(value, isValid) => this.inputChange("passwordRepeat", value, isValid)}
                formInput={this.state.formState.passwordRepeat}
              />
            </div>

          </div>        
          <div className="hint">
            *-поля, обязательные для заполнения
          </div>
          {!this.state.isPasswordEquals && (
            <div className="error-message">
              Пароли должны совпадать
            </div>
          )}
          <AcButton title="Зарегистрироваться"
            type="primary"
            onClick={this.signup}
            disabled={!this.state.isFormValid}/>
        </AcLoader>
        {this.state.redirect ? <Redirect to="/" /> : ""}
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
  private signup() {
    const model: SignupModel = {
      District: +this.state.formState.district.value,
      FirstName: this.state.formState.firstName.value,
      LastName: this.state.formState.lastName.value,
      Patronym: this.state.formState.patronym.value,
      Email: this.state.formState.email.value,
      Snils: +this.state.formState.snils.value,
      Sex: +this.state.formState.sex.value,
      Password: this.state.formState.password.value,
      PasswordRepeat: this.state.formState.passwordRepeat.value
    }

    this.loadingService.changeLoader(true);
    this.userService.signup(model).then(() => {
      this.loadingService.changeLoader(false);
      this.setState({ redirect: true });
    });
  }

  @Autobind
  private validateForm() {
    let valid = Object.keys(this.state.formState).every((field: any) => {
      let input = field as keyof FormFields;
      return this.state.formState[input].valid;
    });

    const isPasswordEquals = this.state.formState.password.value === this.state.formState.passwordRepeat.value;

    this.setState({
      isFormValid: valid && isPasswordEquals,
      isPasswordEquals
    });
  }
}