import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../models";

import "./ProjectCard.component.scss";
import { GetProjectStatus } from "../../helpers";

interface Props {
  project: Project
}

export class ProjectCard extends Component<Props> {
  public render()  {
    const projectStatus = GetProjectStatus(this.props.project);
    return (
      <Link to={`/current-projects/${this.props.project.Id}`}>
        <div className="project-card">
          <div className="card-image">
            <img src={this.props.project.ProjectImage} alt=""/>
          </div>
          <div className="card-content">
            <h3 className="title">{this.props.project.ProjectTitle}</h3>
            <div className="description">{this.props.project.ProjectDescription}</div>
            <div className={`status ${projectStatus.type}`}>
              <i>{projectStatus.message}</i>
            </div>
          </div>
        </div>
      </Link>
     
    );
  }
}