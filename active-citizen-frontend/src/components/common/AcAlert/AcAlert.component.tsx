import React, { Component } from "react";

import "./AcAlert.component.scss";

export class AcAlert extends Component {
  public render() {
    return (
      <div className="ac-alert">
        {this.props.children}
      </div>
    )
  }
}