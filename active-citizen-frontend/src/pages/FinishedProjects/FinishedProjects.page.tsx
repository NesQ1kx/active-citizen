import React, { Component } from "react";
import { Page, AcLoader, AcEmptyState, FinishedProjectCard } from "../../components";
import { Project } from "../../models";
import { ProjectService, LoadingService } from "../../services";

import "./FinishedProjects.page.scss";
import { GetProjectPhase } from "../../helpers";

interface Props {}

interface State {
  projects: Project[];
}

export class FinishedProjects extends Component {
  public state: State = {
    projects: [],
  }

  private projectService: ProjectService;
  private loadingService: LoadingService

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.projectService.getAllProjects().then((data: any) => {
      this.setState({ projects: data }, () => this.loadingService.changeLoader(false));
    });
  }

  public render() {
    const projectsToShow = this.state.projects.filter(Boolean);
    return (
      <Page title="Заверёшнные проекты" width="1192">
        <AcLoader>
          {projectsToShow.length 
            ? (<div className="finished-projects">
              {projectsToShow.map((item, index) => (
                <FinishedProjectCard project={item} key={index} />
              ))}
            </div>)
            : <AcEmptyState text="Пока нет завершённых проектов" />
          }
        </AcLoader>
      </Page>
    );
  }
}