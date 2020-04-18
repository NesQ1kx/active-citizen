import React, { Component } from "react";
import { ProjectDirection } from "../../models";

import "./DirectionCard.component.scss";
import { Redirect } from "react-router";
import { Autobind } from "../../helpers";

interface Props {
  direction: ProjectDirection
}

interface State {
  isRedirect: boolean;
}

export class DirectionCard extends Component<Props, State> {
  public state: State = {
    isRedirect: false,
  }
  public render() {
    return (
      <div className="direction-card" onClick={this.redirect}>
        <span className="head">Направление</span>
        <div className="divider-white"></div>
        <span className="title">
         {this.props.direction.DirectionTitle}
        </span>
        <div className="divider-white"></div>
        <div className="statistic">
          <div className="statistic-item">
            <i className="far fa-lightbulb fa-2x"></i>
            <span className="count">{this.props.direction.CountOfIdeas}</span>
          </div>
          <div className="statistic-item">
            <i className="fas fa-comment-dots fa-2x"></i>
            <span className="count">{this.props.direction.CountOfComments}</span>
          </div>
        </div>
        {this.state.isRedirect && (<Redirect to={`/direction/${this.props.direction.Id}`} />)}
      </div>
    )
  }

  @Autobind
  private redirect() {
    this.setState({ isRedirect: true });
  }
}