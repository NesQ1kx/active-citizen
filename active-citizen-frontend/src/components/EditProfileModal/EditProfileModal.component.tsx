import React, { Component } from "react";
import { User } from "../../models";

import "./EditProfileModal.component.scss";
import { FormInput, EditUserProfileModel } from "../../types";
import { districts } from "../../pages/SignupPage/Constants";
import { requireValidationFunction, snilsValidationFunction } from "../../constants";
import { Autobind } from "../../helpers";
import { AcInput, AcDropDown, AcDatePciker, AcButton } from "..";

interface FormFields {
  firstName: FormInput;
  lastName: FormInput;
  patronym: FormInput;
  district: FormInput;
  snils: FormInput;
  dateOfBirth: FormInput;
}

interface Props {
  user: User;
  onSave: (model: EditUserProfileModel) => void;
}

interface State {
  formState: FormFields;
  isFormValid: boolean;
}

export class EditProfileModal extends Component<Props, State> {
  public state: State = {
    isFormValid: false,
    formState: {
      district:  {
        value: districts[0],
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
      snils:  {
        value: '',
        validationFunctions: [requireValidationFunction, snilsValidationFunction],
        valid: false,
      },
      dateOfBirth: {
        value: '',
        validationFunctions: [requireValidationFunction],
        valid: false,
      },
    }
  }

  public componentDidMount() {
    this.setState({
      formState : {
        firstName: { ... this.state.formState.firstName, value: this.props.user.FirstName, valid: true },
        lastName: { ... this.state.formState.lastName, value: this.props.user.LastName, valid: true },
        patronym: { ... this.state.formState.patronym, value: this.props.user.Patronym, valid: true },
        snils: { ... this.state.formState.snils, value: this.props.user.Snils, valid: true },
        district: { ... this.state.formState.district, value: { key: this.props.user.District, value: this.props.user.DistrictNavigation.Name, valid: true } },
        dateOfBirth: { ... this.state.formState.dateOfBirth, value: this.props.user.DateOfBirth, valid: true },
      },
      isFormValid: true,
    });
  }

  public render() {
    return (
      <div className="edit-profile-modal">
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
          label="СНИЛС"
          isRequired={true}
          onChange={(value, isValid) => this.inputChange("snils", value, isValid)}
          formInput={this.state.formState.snils}
        />
        <AcDropDown label="Район проживания"
          formInput={this.state.formState.district}
          list={districts}
          isRequired={true}
          onChange={(value) => this.inputChange("district", value, true)}
        />
        <AcDatePciker
          formInput={this.state.formState.dateOfBirth}
          label="Дата рождения"
          isRequired={true}
          maxDate={new Date()}
          onChange={(value) => this.inputChange("dateOfBirth", value, true)}
        />
        <div className="modal-footer">
          <AcButton
            title="Сохранить"
            type="primary"
            disabled={!this.state.isFormValid}
            onClick={this.onSaveClick}
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
    }, () => {
      this.validateForm();
    });
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
  private onSaveClick() {
    const model: EditUserProfileModel = {
      Id: this.props.user.Id,
      LastName: this.state.formState.lastName.value,
      FirstName: this.state.formState.firstName.value,
      Patronym: this.state.formState.patronym.value,
      District: this.state.formState.district.value.key,
      DateOfBirth: +this.state.formState.dateOfBirth.value,
      Snils: +this.state.formState.snils.value,
    }

    this.props.onSave(model);
  }
}