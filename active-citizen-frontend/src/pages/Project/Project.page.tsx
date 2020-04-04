import React, { Component } from 'react';
import { Page, AcButton } from '../../components';
import { ProjectService, LoadingService, UserService, ToastService } from '../../services';
import { Project, User, Roles } from '../../models';

import "./Project.page.scss";
import { Link, Redirect } from 'react-router-dom';
import { EventType } from '../../types';
import { Autobind } from '../../helpers';

interface Props {
  match: any;
}

interface State {
  project?: Project;
  currentUser?: User;
  redirect: boolean;
  isUserParticipate: boolean;
}

export class ProjectPage extends Component<Props, State> {
  public state: State = {
    project: undefined,
    currentUser: undefined,
    redirect: false,
    isUserParticipate: false,
  }
  private projectService: ProjectService;
  private loadingService: LoadingService;
  private userService: UserService;
  private toastService: ToastService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.userService = UserService.instance;
    this.toastService = ToastService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.projectService.getProjectById(this.props.match.params.id).then((project: any) => {
      this.setState({ project: project }, () => {
        this.projectService.isUserParticipate(this.state.project!.Id, this.state.currentUser!.Id).then((response: any) => {
          this.setState({ isUserParticipate: response });
          this.loadingService.changeLoader(false);
        });
      });
    });
    this.userService.$currentUser.subscribe(user => this.setState({ currentUser: user }));
  }

  public render() {
    return (
      this.state.project && (
        <Page title={this.state.project!.ProjectTitle}>
          <div className="project-page">
            {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
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
            )}
            <div className="dates">
              <span>{ new Date(this.state.project!.ProposeStartDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }) } </span>-
              <span> { new Date(this.state.project!.VoteEndDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit' }) }</span>
            </div>
            <div className="content">
              <pre style={{whiteSpace: "pre-wrap"}}>
                {this.state.project.ProjectDescription}
              </pre>
            </div>
            <div className="actions">
              {!this.state.isUserParticipate && (
                <AcButton
                type="secondary"
                title="Присоединиться"
                onClick={this.participate}
              />
              )}
              {this.state.isUserParticipate && (!(this.state.project!.ProposeStartDate > Date.now()) 
              ? (
                  <div>
                    {Date.now() > this.state.project!.ProposeEndDate
                    ? (
                        <AcButton
                          type="secondary"
                          title="Перейти к голосованию"
                        />
                      )
                    : (
                        <AcButton
                          type="secondary"
                          title="Предложить идею"
                        />
                      )}
                    <AcButton
                      type="secondary"
                      title="К обсуждению идей"
                    />
                  </div>
                )
              : (
                <i>
                  <strong>
                    Вы присоединились к проекту, но он ещё не начался. <br/> Мы пришлём вам уведомление о начале.
                  </strong>
                </i>
              ))}
            </div>
          </div>
          {this.state.redirect && <Redirect to="/current-projects"/>}
        </Page>
      ) || <div></div>
    )
  }

  @Autobind
  private deleteProject() {
    this.projectService.deleteProject(this.state.project!.Id).then(() => {
      this.toastService.changeEvent({ message: "Проект успешно удалён", type: EventType.Success, show: true });
      this.setState({ redirect: true });
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