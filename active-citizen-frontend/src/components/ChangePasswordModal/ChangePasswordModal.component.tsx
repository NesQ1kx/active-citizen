import React, { Component } from "react";

import "./ChangePasswordModal.component.scss";
import { FormInput } from "../../types";
import { requireValidationFunction, passwordValidationFunction } from "../../constants";
import { Autobind } from "../../helpers";
import { AcInput, AcButton } from "../common";

interface FormFields {
  oldPassword: FormInput;
  newPassword: FormInput;
  repeatPassword: FormInput;
}

interface Props {
  onSave: (oldPassword: string, newPassword: string) => void;
}

interface State {
  formState: FormFields;
  isFormValid: boolean;
  isPasswordEquals: boolean;
}

export class ChangePasswordModal extends Component<Props, State> {
  public state: State ={
    isPasswordEquals: false,
    isFormValid: false,
    formState: {
      oldPassword: {
        value: '',
        validationFunctions: [requireValidationFunction, passwordValidationFunction],
        valid: false,
      },
      newPassword: {
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
  public render() {
    return (
      <div className="change-password-modal">
        <AcInput inputType="password"
            label="Cтарый пароль"
            isRequired={true}
            onChange={(value, isValid) => this.inputChange("oldPassword", value, isValid)}
            formInput={this.state.formState.oldPassword}
          />
          <AcInput inputType="password"
            label="Новый пароль"
            isRequired={true}
            withHint={true}
            hintText={"Пароль не может быть короче 8 символов и должен содержать латинские буквы и цифры"}
            onChange={(value, isValid) => this.inputChange("newPassword", value, isValid)}
            formInput={this.state.formState.newPassword}
          />
          <AcInput inputType="password"
            label="Повтор пароля"
            isRequired={true}
            onChange={(value, isValid) => this.inputChange("repeatPassword", value, isValid)}
            formInput={this.state.formState.repeatPassword}
          />
          <div className="modal-footer">
            <AcButton
              type="primary"
              title="Сохранить"
              disabled={!this.state.isFormValid}
              onClick={this.onSaeveClick}
            />
          </div>
      </div>
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

    const isPasswordEquals = this.state.formState.newPassword.value === this.state.formState.repeatPassword.value;
    this.setState({
      isFormValid: valid && isPasswordEquals,
      isPasswordEquals
    });
  }

  @Autobind
  private onSaeveClick() {
    this.props.onSave(this.state.formState.oldPassword.value, this.state.formState.newPassword.value);
  }
}