import React, { Component } from 'react';

import { Page, AcButton, DirectionCard, AcAlert, AcLoader, GeneratePDFModal } from '../../components';
import { ProjectService, LoadingService, UserService, ToastService, ModalService } from '../../services';
import { Project, User, Roles } from '../../models';

import "./Project.page.scss";
import { Link, Redirect } from 'react-router-dom';
import { EventType } from '../../types';
import { Autobind, GetProjectPhase, DateFormatter } from '../../helpers';
import { RouterService } from '../../services/Router.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  match: any;
}

interface State {
  project?: Project;
  currentUser?: User;
  isUserParticipate: boolean;
}

export class ProjectPage extends Component<Props, State> {
  public state: State = {
    project: undefined,
    currentUser: undefined,
    isUserParticipate: false,
  }
  private projectService: ProjectService;
  private loadingService: LoadingService;
  private userService: UserService;
  private toastService: ToastService;
  private routerService: RouterService;
  private modalService: ModalService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.userService = UserService.instance;
    this.toastService = ToastService.instance;
    this.routerService = RouterService.instance;
    this.modalService = ModalService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.projectService.getProjectById(this.props.match.params.projectId).then((project: any) => {
      this.loadingService.changeLoader(false);
      this.setState({ project: project }, () => {
        this.userService.$currentUser.subscribe(user => {
          this.setState({ currentUser: user }, () => {
            this.state.currentUser && this.projectService.isUserParticipate(this.state.project!.Id, this.state.currentUser!.Id).then((response: any) => {
              this.setState({ isUserParticipate: response });
            });
          });
        });
      });
    });
  }

  public render() {
    const projectPhase = this.state.project && GetProjectPhase(this.state.project!);
    return (
      this.state.project && (
        <Page title={this.state.project.ProjectTitle}>
          <AcLoader>
            {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
              <div className="page-actions">
                <div className="button-container">
                  {projectPhase === "NOT_STARTED" && (
                    <AcButton 
                      type="primary"
                      title="Оповестить о начале проекта" 
                      onClick={this.notifyUsers}              
                    />
                  )}
                  <Link to={`/edit-project/${this.state.project!.Id}`}>
                    <AcButton
                      type="primary"
                      title="Редактировать"  
                    />
                  </Link>
                  <AcButton
                    type="negative"
                    title="Удалить"
                    onClick={this.deleteProject}
                  />
                </div>
              </div>
              )}
            <div className="project-page">
              <div className="dates">
                <div className={`date ${projectPhase === "PROPOSE" ? "-propose" : ""}`}>{DateFormatter(this.state.project!.ProposeStartDate)} - {DateFormatter(this.state.project!.ProposeEndDate)} Фаза подачи идей
                  {projectPhase === "PROPOSE" && (<i className="fas fa-angle-double-left"></i>)}
                </div>
                <div className={`date ${projectPhase === "VOTING" ? "-voting" : ""}`}>{DateFormatter(this.state.project!.VoteStartDate)} - {DateFormatter(this.state.project!.VoteEndDate)} Фаза голосования
                  {projectPhase === "VOTING" && (<i className="fas fa-angle-double-left"></i>)}
                </div>
              </div>
              <div className="content">
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {this.state.project.ProjectDescription}
                </pre>
              </div>
              {this.state.currentUser
                ? (<div className="actions">
                    {!this.state.isUserParticipate && (
                      <AcButton
                      type="secondary"
                      title="Присоединиться"
                      onClick={this.participate}
                    />
                    )}
                    {this.state.isUserParticipate && projectPhase === "NOT_STARTED" && (
                      <AcAlert type="positive" text="Вы присоединились к проекту, но он ещё не начался. Мы пришлём вам уведомление о начале. Пока что, вы можете ознакомиться с направлениями проекта и подумать над идеями." /> )}
                    {this.state.isUserParticipate && (projectPhase === "PROPOSE" || projectPhase === "VOTING") && (
                      <AcAlert text="Проект стартовал! Вы можете предлагать свои идеи." type="positive" />)}
                  </div>)
                : (<AcAlert text="Войдите в систему, чтобы принять участие в проекте." type="negative" />)}
              {projectPhase === "FINISHED" && (<AcAlert text="Проект завершён. Дожтитесь сбора статистики и реализации идей" type="negative" />)}
              <div className="divider"></div>
              <div className="direction-block">
                {this.state.project!.ProjectDirection.map((item, index) => (
                  <DirectionCard direction={item} key={index} />
                ))}
              </div>
            </div>
          </AcLoader>
        </Page>
      ) || <div></div>
    )
  }

  @Autobind
  private deleteProject() {
    this.projectService.deleteProject(this.state.project!.Id).then(() => {
      this.toastService.changeEvent({ message: "Проект успешно удалён", type: EventType.Success, show: true });
      this.routerService.redirect("/current-projects")
    })
  }

  @Autobind
  private participate() {
    this.projectService.participate(this.state.project!.Id, this.state.currentUser!.Id).then(() => {
      this.toastService.changeEvent({ message: "Вы присоединились к проекту", type: EventType.Success, show: true });
      this.projectService.isUserParticipate(this.state.project!.Id, this.state.currentUser!.Id).then((response: any) => {
        this.setState({ isUserParticipate: response });
      });
    });
  }

  @Autobind
  private notifyUsers() {
    this.loadingService.changeLoader(true);
    this.userService.notifyUsersAboutProjectStart(this.state.project!.Id).then(() => {
      this.toastService.changeEvent({ message: "Пользователи оповещены", type: EventType.Success, show: true });
      this.loadingService.changeLoader(false);
    });
  }


  @Autobind
  private openModal() {
    this.modalService.changeModalVisibility(true, {
      title: "Сгенерировать отчёт",
      body: <GeneratePDFModal project={this.state.project!} onConfirm={this.generatePDF}/>
    });
  }

  @Autobind
  private generatePDF() {
    const input = document.getElementById("to-pdf");
    if (input) {
      html2canvas(input).then(canvas => {
        const doc = new jsPDF({ format: 'a4' });
        doc.addImage(canvas.toDataURL(), 'PNG', 0, 0);
        doc.save(`Проект_${this.state.project!.ProjectTitle}_Идеи`);
      });
    }
  }
}