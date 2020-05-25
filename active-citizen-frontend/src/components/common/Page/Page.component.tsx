import React, { Component } from "react";

import "./Page.component.scss";

interface Props {
  title: string;
  width?: string;
}


export class Page extends Component<Props> {
  public render() {
    return (
      <div className="page" style={{gridTemplateColumns: `minmax(100%, ${this.props.width ? this.props.width : 768}px)`}}>
        <div className="page-title">
          {this.props.title}
        </div>
        <div className="page-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}