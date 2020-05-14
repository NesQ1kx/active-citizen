import React, { Component } from "react";

import "./FinishedProject.page.scss";
import { Project, User, Roles } from "../../models";
import { ProjectService, UserService, LoadingService, ToastService } from "../../services";
import { Page, AcLoader, AcEmptyState, ProjectStatistic, AcButton } from "../../components";
import { GetIdeaSpelling } from "../../helpers/GetIdeaSpelling.helper";
import { EventType } from "../../types";
import { Autobind } from "../../helpers";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  match: any;
}

interface State {
  project?: Project;
  currentUser?: User;
}

export class FinishedProject extends Component<Props, State> {
  public state: State = {
    project: undefined,
    currentUser: undefined,
  }

  private projectService: ProjectService;
  private userService: UserService;
  private loadingService: LoadingService;
  private toastService: ToastService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.userService = UserService.instance;
    this.loadingService = LoadingService.instance;
    this.toastService = ToastService.instance;
  }

  public componentDidMount() {
    this.loadProject();
    this.userService.$currentUser.subscribe((user: any) => {
      user && this.setState({ currentUser: user });
    });
  }

  public render() {
    const project = this.state.project!;
    return (
      project && (
        <Page title={`Завершённый проект: ${project.ProjectTitle}`}>
          <AcLoader>
            <div className="finished-project">
              <div className="scores">
                <div className="statistic-item">
                  <i className="far fa-lightbulb fa-2x"></i>
                  <span className="count">{project.IdeasCount}</span>
                </div>
                <div className="statistic-item">
                  <i className="fas fa-user-alt fa-2x"></i>
                  <span className="count">{project.ParticipantsCount}</span>
                </div>
              </div>
              <div className="description">
                <span>В ходе проекта его участники предложили <span className="highlight">{project.IdeasCount}
                </span> {GetIdeaSpelling(project.IdeasCount)} в следующих направлениях:</span>
                <div className="directions">
                  {project.ProjectDirection.map((direction, index) => (
                    <div className="direction" key={index}>
                      <div className="dot"></div>
                      <span>«{direction.DirectionTitle}»</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="divider"></div>
              <div className="ideas">
                <h3>Идеи, выбранные участниками проекта</h3>
                {project.ProjectDirection.some(direction => direction.DirectionIdea.some(idea => !idea.IsRealised && idea.Status === 1)) 
                  ? project.ProjectDirection.map((direction, index) => (
                    <div key={index}>
                      {direction.DirectionIdea.some(idea => !idea.IsRealised && idea.Status === 1) && (
                        <div className="direction">
                          <h4 className="title">Направление: "{direction.DirectionTitle}"</h4>
                          {direction.DirectionIdea.filter(idea => idea.Status === 1 && !idea.IsRealised).map((idea, key) => (
                            <div className="idea" key={key}>
                              <div className="index">{key + 1}. </div>
                              <div className="content">
                                <div>{idea.IdeaDescription}</div>
                                {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
                                  <span className="link" onClick={() => this.realiseIdea(idea.Id)} >Идея реализована</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    ))
                  : <AcEmptyState text="Все идеи уже реализованы! Вы можете ознакомиться со списком ниже." />          
                }
              </div>
              <div className="divider"></div>
              <div className="ideas">
                <h3>Идеи, реализованные городом</h3>
                {project.ProjectDirection.some(direction => direction.DirectionIdea.some(idea => idea.IsRealised && idea.Status === 1)) 
                  ? project.ProjectDirection.map((direction, index) => (
                    <div key={index}>
                      {direction.DirectionIdea.some(idea => idea.IsRealised && idea.Status === 1) && (
                        <div className="direction">
                          <h4 className="title">Направление: "{direction.DirectionTitle}"</h4>
                          {direction.DirectionIdea.filter(idea => idea.Status === 1 && idea.IsRealised).map((idea, key) => (
                            <div className="idea" key={key}>
                              <div className="index">{key + 1}. </div>
                              <div>{idea.IdeaDescription}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    ))
                  : <AcEmptyState text="Пока нет ни одной реализованной идеи. Они будут появлятся в это списке по мере реализации." />          
                }
              </div>
              <div className="divider"></div>
              <div >
                <h3>Статистика проекта</h3>
                <ProjectStatistic project={this.state.project!} />
              </div>
              <div className="divider"></div>
              <AcButton
                title="Выгрузить статистику"
                type="secondary"
                onClick={this.generatePDF}
              />
            </div>
          </AcLoader>
        </Page> 
      ) || <div></div>
    );
  }

  private loadProject() {
    this.loadingService.changeLoader(true);
    this.projectService.getProjectById(this.props.match.params.projectId).then((project: any) => {
      this.setState({ project }, () => this.loadingService.changeLoader(false));
    });
  }

  private realiseIdea(id: number) {
    this.projectService.realiseIdea(id).then(() => {
      this.loadProject();
      this.toastService.changeEvent({ message: "Идея добавлена в список реализованных", type: EventType.Success, show: true });
    }, () => {
      this.toastService.changeEvent({ message: "Ошибка сервера", type: EventType.Error, show: true });
    });
  }

  @Autobind
  private generatePDF() {
    const input = document.getElementById("to-pdf");
     if (input) {
      html2canvas(input).then(canvas => {
        console.log(canvas.toDataURL("image/jpeg"));
        const doc = new jsPDF({ orientation: 'p', format: 'a4' });
        doc.addImage(canvas.toDataURL(), "PNG", 0, 0);
        doc.save(`Статистика проекта: ${this.state.project!.ProjectTitle}`);
      });
     }
  }
}