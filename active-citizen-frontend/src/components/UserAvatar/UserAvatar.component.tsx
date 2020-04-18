import React, { Component } from "react";

import "./UserAvatar.component.scss";

interface Props {
  source: string;
  size: string;
}

export class UserAvatar extends Component<Props> {
  public render() {
    return (
      <div className="user-avatar">
        <img className={`image ${this.props.size}`} src={this.props.source} alt=""/>
      </div>
    )
  }
}