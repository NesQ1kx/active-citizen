import React, { Component } from "react";
import { Project } from "../../models";
import { Link } from "react-router-dom";

import "./FinishedProjectCard.component.scss";

interface Props {
  project: Project
}

export class FinishedProjectCard extends Component<Props> {
  public render() {
    return (
      <Link to="/">
        <div className="finished-project-card">
          <div className="card-image">
            <img src={this.props.project.ProjectImage} alt=""/>
          </div>
          <div className="card-content">
            <h3 className="title">{this.props.project.ProjectTitle}</h3>
            <div className="statistic">
              <div className="statistic-item">
                <i className="far fa-lightbulb fa-2x"></i>
                <span className="count">{this.props.project.IdeasCount}</span>
              </div>
              <div className="statistic-item">
              <i className="fas fa-user-alt fa-2x"></i>
                <span className="count">{this.props.project.ParticipantsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}