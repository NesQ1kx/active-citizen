import React, { Component } from "react";
import { Page, AcInput, AcButton, AcLoader } from "../../components";
import { FormInput, EventType } from "../../types";
import { requireValidationFunction, emailValidationFunction } from "../../constants";
import { Autobind } from "../../helpers";
import { UserService, ToastService, LoadingService } from "../../services";

import "./RequestReset.page.scss";

interface Props {}

interface State {
  input: FormInput;
}

export class RequestReset extends Component<Props, State> {
  public state: State = {
    input: {
      valid: false,
      validationFunctions: [requireValidationFunction, emailValidationFunction],
      value: '',
    }
  }

  private userService: UserService;
  private toastService: ToastService;
  private loadingService: LoadingService;

  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
    this.toastService = ToastService.instance;
    this.loadingService = LoadingService.instance;
  }

  public render() {
    return (
      <Page title="" width="440">
        <AcLoader>
          <div className="request-reset">
            <h3>Запрос на сброс пароля</h3>
            <span>
              Укажите свой электронный адрес
            </span>
            <AcInput
              formInput={this.state.input}
              inputType="text"
              onChange={(value, valid) => this.inputChange(value, valid)}
            />
            <AcButton
              type="primary"
              title="Отправить"
              disabled={!this.state.input.valid}
              onClick={this.requestPasswordReset}
            />
          </div>
        </AcLoader>
      </Page>
    );
  }

  @Autobind
  private inputChange(value: any, isValid: boolean) {
    this.setState({
      input: { ... this.state.input, value, valid: isValid }
    });
  }

  @Autobind
  private requestPasswordReset() {
    this.loadingService.changeLoader(true);
    this.userService.requestPasswordReset(this.state.input.value).then(() => {
      this.loadingService.changeLoader(false);
      this.toastService.changeEvent({ message: "Дальнейшие инструкции направлены на указанный адрес", type: EventType.Success, show: true });
    }, error => {
      this.toastService.changeEvent({ message: error, type: EventType.Error, show: true });
    });
  }
}