import React, { Component } from "react";
import { ProjectDirection } from "../../models";

import "./DirectionCard.component.scss";
import { Redirect } from "react-router";
import { Autobind } from "../../helpers";
import { RouterService } from "../../services/Router.service";

interface Props {
  direction: ProjectDirection
}


export class DirectionCard extends Component<Props> {
  private routerService: RouterService;
  constructor(props: Props) {
    super(props);
    this.routerService = RouterService.instance;
  }

  public render() {
    return (
      <div className="direction-card" onClick={this.openDirection}>
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
            <span className="count">{this.props.direction.DirectionIdea.map(item => item.CountOfComments).reduce((sum, value) => sum + value, 0)}</span>
          </div>
        </div>
      </div>
    )
  }

  @Autobind
  private openDirection() {
    this.routerService.redirect(`/direction/${this.props.direction.Id}`);
  }
}