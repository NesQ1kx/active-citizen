import React, { Component } from "react";

import "./AcEmptyState.component.scss";

interface Props {
  text: string;
}

export class AcEmptyState extends Component<Props> {
  public render() {
    return (
      <div className="ac-empty-state">
        <div className="placeholder">
          <i className="fas fa-exclamation-circle fa-5x"></i>
          <span className="text">{ this.props.text }</span>
        </div>
      </div>
    );
  }
}