import React, { Component } from "react";

import "./AcButton.component.scss";
import { Autobind } from "../../../helpers";

interface Props {
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  isPrimary?: boolean
}

export class AcButton extends Component<Props> {
  public render() {
    return (
      <button className={`ac-button ${this.props.isPrimary ? 'primary' : ''} ${this.props.disabled ? 'disabled' : ''}`}
              onClick={this.props.onClick}>
        {this.props.title}
      </button>
    )
  }

  @Autobind
  private onClick() {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick();
    }
  }
}