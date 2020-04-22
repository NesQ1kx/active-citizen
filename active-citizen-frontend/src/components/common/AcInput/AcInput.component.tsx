import React, { Component, ChangeEvent } from "react";
import { Autobind } from "../../../helpers";

import "./AcInput.component.scss";
import { LabelWithHover } from "../../LabelWithHover";
import { FormInput } from "../../../types";


interface Props {
  label?: string;
  inputType: string;
  isRequired?: boolean;
  onChange?: (value: any, valid: boolean) => void;
  withHint?: boolean;
  hintText?: string;
  formInput: FormInput
}

interface State {
  isValid: boolean;
  isRequiredError: boolean;
  value: any;
  errorMessages: string[];
}


export class AcInput extends Component<Props, State> {
  public state: State = {
    isValid: true,
    isRequiredError: false,
    value: '',
    errorMessages: [],
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ value: nextProps.formInput.value });
  }

  public render() {
    return (
      <div className="ac-input">
        <div style={{display: "flex"}}>
          <label className={!this.state.isValid ? "error" : ""}>{this.props.label}{this.props.isRequired ? "*" : ""}</label>
          {this.props.withHint && (
            <LabelWithHover text={this.props.hintText!}>
              <i className="fas fa-info-circle"></i>
            </LabelWithHover>
          )}
        </div>
        <input className={!this.state.isValid ? "error" : ""} type={this.props.inputType}
               onChange={this.onChange}
               onBlur={this.onBlur}
               value={this.state.value}/>
        <div className="error-msg">
          {this.state.errorMessages.map((message, index) => (<div key={index}>{message}</div>))}
        </div>
      </div>
    )
  }

  @Autobind
  private onChange(event: ChangeEvent<HTMLInputElement>) {
    const result = this.validateInput(event.target.value);
    this.setState({
      value: event.target.value,
      isValid: result.isValid,
      errorMessages: result.messages
    }, () => this.props.onChange && this.props.onChange(this.state.value, this.state.isValid));
  }

  @Autobind
  private onBlur() {
    const result = this.validateInput(this.state.value);
    this.setState({
      isValid: result.isValid,
      errorMessages: result.messages
    });
  }

  @Autobind
  private validateInput(value: any) {
    let isValid = false;
    let messages: string[] = [];
    if (!this.props.formInput!.validationFunctions.length) {
      isValid = true;
    } else {
      this.props.formInput!.validationFunctions.forEach(fn => {
        const result = fn(value);
        isValid = result.isValid;
        if (!isValid) {
          messages.push(result.errorMessage);
        }
      });
    }

    return {
      isValid,
      messages,
    }
  }
}