import React, { Component } from 'react';
import { Page, AcButton, DirectionCard, AcAlert } from '../../components';
import { ProjectService, LoadingService, UserService, ToastService } from '../../services';
import { Project, User, Roles } from '../../models';

import "./Project.page.scss";
import { Link, Redirect } from 'react-router-dom';
import { EventType } from '../../types';
import { Autobind } from '../../helpers';
import { RouterService } from '../../services/Router.service';

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

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.userService = UserService.instance;
    this.toastService = ToastService.instance;
    this.routerService = RouterService.instance;
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
    return (
      this.state.project && (
        <Page title={this.state.project!.ProjectTitle}>
           {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
            <div className="page-actions">
              <div className="button-container">
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
              <span>{ new Date(this.state.project!.ProposeStartDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }) } </span>-
              <span> { new Date(this.state.project!.VoteEndDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }) }</span>
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
                  {this.state.isUserParticipate && (this.state.project!.ProposeStartDate > Date.now()) && (
                    <AcAlert type="positive" text="Вы присоединились к проекту, но он ещё не начался. Мы пришлём вам уведомление о начале. Пока что, вы можете ознакомиться с направлениями проекта и подумать над идеями." />                  )}
                  {this.state.isUserParticipate && (Date.now() > this.state.project!.ProposeStartDate) && (
                    <AcAlert text="Проект стартовал! Вы можете предлагать свои идеи." type="positive" />)}
                </div>)
              : (<AcAlert text="Войдите в систему, чтобы принять участие в проекте." type="negative" />)}
            <div className="divider"></div>
            <div className="direction-block">
              {this.state.project!.ProjectDirection.map((item, index) => (
                <DirectionCard direction={item} key={index} />
              ))}
            </div>
          </div>
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
}