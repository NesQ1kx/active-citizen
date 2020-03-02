import React, { Component } from "react";

import "./Page.component.scss";

interface Props {
  title: string;
  width?: string;
}


export class Page extends Component<Props> {
  public render() {
    return (
      <div className="page" style={{maxWidth: `${this.props.width ? this.props.width : 768 }px` }}>
        <h2 className="page-title">
          {this.props.title}
        </h2>
        <div className="page-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}