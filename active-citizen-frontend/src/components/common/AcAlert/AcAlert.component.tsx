import React, { Component } from "react";

import "./AcAlert.component.scss";

interface Props {
  text: string
  type?: string;
}

export class AcAlert extends Component<Props> {
  public render() {
    return (
      <div className={`ac-alert ${this.props.type ? this.props.type : 'default'}`}>
        <i className="fas fa-info-circle"></i>
        <span className="text">
          {this.props.text}
        </span>
      </div>
    )
  }
}