import React, { Component } from "react";

import "./LabelWithHover.component.scss";
import { Autobind } from "../../helpers";

interface Props {
  text: string;
}

interface State {
  show: boolean;
}

export class LabelWithHover extends Component<Props, State> {
  public state: State = {
    show: false
  };

  public render() {
    return(
      <div className="label-with-hover"
           onMouseOver={this.mouseOver}
           onMouseOut={this.mouseOut}
      >
      {this.props.children}
      {this.state.show && (
      <div className="text">
        {this.props.text}
      <div className="arrow"></div>
      </div>
      )}
    </div>
    )
  }

  @Autobind
  private mouseOver() {
    this.setState({
      show: true
    });
  }

  @Autobind
  private mouseOut() {
    this.setState({
      show: false
    });
  }
}