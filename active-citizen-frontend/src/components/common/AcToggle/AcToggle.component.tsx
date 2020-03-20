import React, { Component, ChangeEvent } from "react";

import "./AcToggle.component.scss";
import { Autobind } from "../../../helpers";

interface Props {
  title: string;
  onChange?: (value: any, valid: boolean) => void;
}

interface State {
  value: boolean;
}

export class AcToggle extends Component<Props, State> {
  public render() {
    return (
      <div className="ac-toggle">
        <label>{this.props.title}</label>
        <label className="switch">
          <input type="checkbox" onChange={this.onChange}/>
          <span className="slider round"></span>
        </label>
      </div>
    )
  }

  @Autobind
  private onChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist();
    this.setState({ value: event.target.checked  }, () => this.props.onChange && this.props.onChange(this.state.value, true));
  }
}