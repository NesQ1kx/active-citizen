import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Page, AcLoader, AcEmptyState, ProjectCard, AcToggle } from "../../components";
import { ProjectService, LoadingService, UserService } from "../../services";
import { Project, User } from "../../models";

import "./CurrentProjects.component.scss";
import { Autobind } from "../../helpers";
import { Roles } from "../../models/Roles";
import { FormInput } from "../../types";

interface Props {}

interface State {
  projects: Project[];
  showAllProjects: FormInput;
  currentUser?: User;
}

export class CurrentProjects extends Component<Props, State> {
  public state: State = {
    projects: [],
    showAllProjects: {
      valid: true,
      validationFunctions: [],
      value: false,
    },
    currentUser: undefined,
  }
  private projectService: ProjectService;
  private loadingService: LoadingService;
  private userService: UserService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.userService = UserService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.projectService.getAllProjects().then((data: any) => {
      this.setState({ projects: data }, () => this.loadingService.changeLoader(false));
    });
   this.userService.$currentUser.subscribe(user => this.setState({ currentUser: user }));
  }

  public render() {
    const projectsToShow = this.state.projects.filter(project => this.state.showAllProjects.value ? project : project.IsProjectActive);
    return (
      <Page title="Текущие проекты" width={"1192"}>
        {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
          <AcToggle
            title="Показывать все проекты"
            onChange={(value) => this.toggleProjectVisibility(value, true)}
            formInput={this.state.showAllProjects.value}
          />
        )}
        <AcLoader>
            { projectsToShow.length
            ? 
              (<div className="current-projects">
              {projectsToShow.map((project, index) => (
                <ProjectCard project={project} key={index} />
              ))}
              </div>)
            : (<AcEmptyState text="В настоящий момент нет активных проектов"/>)}
        </AcLoader>
      </Page>
    )
  }

  @Autobind
  private toggleProjectVisibility(value: any, isValid: boolean) {
    this.setState({ showAllProjects: { ...this.state.showAllProjects, value } });
  }
}