import React, { Component, ChangeEvent } from "react";

import "./AcFileInput.component.scss";
import { Autobind } from "../../../helpers";

interface Props {
  title: string;
  onChange: (value: any, valid: boolean) => void;
}

export class AcFileInput extends Component<Props> {
  public render() {
    return (
      <div className="ac-file-input">
        <span className="label">{this.props.title}</span>
        <label htmlFor="file" className="input-label">
          <i className="fas fa-download"></i>
          <span>Выбрать файл</span>
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
      this.props.onChange(reader.result, true);
    }
  }
}