import React, { Component } from "react";

import "./AcRadio.component.scss";
import { Autobind } from "../../../helpers";

interface Props {
  label: string;
  name: string;
  onCheck: () => void;
}

export class AcRadio extends Component<Props> {
  public render() {
    return (
      <label className="container">
          <div>{this.props.label}</div>
          <input type="radio" name={this.props.name} onChange={this.onChange}/>
          <span className="checkmark" ></span>
      </label>
    )
  }

  @Autobind
  private onChange(event: any) {
    event.persist();
    this.props.onCheck();
  }
}