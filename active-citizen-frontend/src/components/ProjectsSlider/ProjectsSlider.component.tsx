import React,{ Component } from "react";
import { ProjectService } from "../../services";
import { Project } from "../../models";

import "./ProjectsSlider.component.scss";
import { Autobind, DateFormatter, GetProjectPhase } from "../../helpers";
import { AcButton } from "../common";
import { RouterService } from "../../services/Router.service";

interface Props {}

interface State {
  projects: Project[];
  activeIndex: number;
}

export class ProjectsSlider extends Component<Props, State> {
  private id: any;
  public state: State = {
    projects: [],
    activeIndex: 0,
  }

  private projectService: ProjectService;
  private routerService: RouterService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.routerService = RouterService.instance;
  }

  public componentDidMount() {
    this.projectService.getAllProjects().then((projects: any) => {
      const projectsToShow: Project[] = projects.some((p: Project) => GetProjectPhase(p) !== "FINISHED" && p.IsProjectActive)
      ? projects.filter((p: Project) => GetProjectPhase(p) !== "FINISHED" && p.IsProjectActive)
      : projects;
      this.setState({ projects: projectsToShow });
    });
    this.startTimer();
  }

  public render() {
    return (
      <div className="projects-slider">
          <div className="project-container">
            {this.state.projects.map((project, index) => (
              this.state.activeIndex === index && (
                <div className="project" key={index}>
                  <div className="image">
                    <img src={project.ProjectImage} />
                  </div>
                  <div className="project-details">
                   <div className="project-title">
                    <div className="dates">
                        {DateFormatter(project.ProposeStartDate)} - {DateFormatter(project.VoteEndDate)}
                      </div>
                      <span className="title">
                        {project.ProjectTitle}
                      </span>
                    </div>
                    <div className="action">
                      {GetProjectPhase(project) !== "FINISHED" && project.IsProjectActive
                      ? (
                        <div>
                          <div className="score">
                            <i className="fas fa-user-alt"></i>
                            <span>{project.ParticipantsCount}</span>
                          </div>
                          <AcButton 
                            title="ПРИСОЕДИНИТЬСЯ"
                            type="negative"
                            onClick={() => this.routerService.redirect(`/current-projects/${project.Id}`)}
                          />
                        </div> )
                      : (
                        <AcButton 
                        title="СТАТИСТИКА ПРОЕКТА"
                        type="negative"
                        onClick={() => this.routerService.redirect(`/finished-projects/${project.Id}`)}
                      />
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="controls">
            <i className="fas fa-angle-left fa-2x" onClick={this.handlePrevClick}></i>
            <i className="fas fa-angle-right fa-2x" onClick={this.handleNextClick}></i>
          </div>
      </div>
    );
  }

  private startTimer() {
    this.id = setInterval(() => {
      let activeIndex = this.state.activeIndex + 1;
      if (activeIndex === this.state.projects.length) {
        activeIndex = 0;
      }
      this.setState({ activeIndex });
    }, 5000);
  }

  private stopTimer() {
    clearInterval(this.id);
  }

  @Autobind
  private handleNextClick() {
    this.stopTimer();
    let activeIndex = this.state.activeIndex;
    if (activeIndex === this.state.projects.length - 1) {
      activeIndex = 0;
    } else if (activeIndex === 0) {
      activeIndex = this.state.activeIndex + 1;
    } else {
      activeIndex = this.state.activeIndex + 1;
    }
    this.setState({ activeIndex }, () => this.startTimer());
  }

  @Autobind
  private handlePrevClick() {
    this.stopTimer();
    let activeIndex = this.state.activeIndex;
    if (activeIndex === 0) {
      activeIndex = this.state.projects.length - 1;
    } else {
      activeIndex = this.state.activeIndex - 1;
    }
    this.setState({ activeIndex }, () => this.startTimer());
  }
}