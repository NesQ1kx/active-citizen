import React, { Component, ChangeEvent } from "react";

import "./AcFileInput.component.scss";
import { Autobind } from "../../../helpers";
import { FormInput } from "../../../types";

interface Props {
  formInput: FormInput;
  title?: string;
  onChange: (value: any, valid: boolean) => void;
}

interface State {
  value: any;
}

export class AcFileInput extends Component<Props, State> {
  public state: State = {
    value: '',
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ value: nextProps.formInput.value });
  }

  public render() {
    return (
      <div className="ac-file-input">
        <span className="label">{this.props.title}</span>
        <label htmlFor="file" className="input-label">
          <i className="fas fa-download"></i>
          <span>Выбрать файл</span>
          {this.state.value && (<span>: 1 файл выбран</span>)}
        </label>
        <input type="file" id="file" className="input-file" onChange={this.onChange}/> 
      </div>
    )
  }

  @Autobind
  private onChange(event: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files![0] as Blob);
    reader.onload = () => {
      this.setState({ value: reader.result} ,() => {
        this.props.onChange(reader.result, true);
      });
    }
  }
}