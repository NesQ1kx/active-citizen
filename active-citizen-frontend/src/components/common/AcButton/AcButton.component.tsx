import React, { Component } from "react";

import "./AcButton.component.scss";

interface Props {
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  isPrimary?: boolean
}

export class AcButton extends Component<Props> {
  public render() {
    return (
      <button className="ac-button" onClick={this.props.onClick}>
        {this.props.title}
      </button>
    )
  }
}