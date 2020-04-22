import React, { Component } from "react";
import { Page, AcButton, UserAvatar, LabelWithHover } from "../../components";
import { ProjectService, UserService, LoadingService, ToastService } from "../../services";
import { DirectionIdea, User, Roles } from "../../models";

import "./Idea.page.scss";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";
import { NavLink } from "react-router-dom";
import { Autobind } from "../../helpers";
import { EventType } from "../../types";

interface Props {
  match: any;
}

interface State {
  idea?: DirectionIdea;
  currentUser?: User;
  isVoted: boolean;
}

export class Idea extends Component<Props, State> {
  public state: State = {
    idea: undefined,
    currentUser: undefined,
    isVoted: false,
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
    this.loadIdea();
  }

  public render() {
    const user = this.state.idea && this.state.idea.User;
    return (
      this.state.idea && (
        <Page title="">
        {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
          <div className="page-actions">
            <AcButton 
              type="negative"
              title="Удалить"
            />
          </div>
        )}
        <div className="idea-page">
          <div className="main-content">
            {user && (
              <UserAvatar source={user!.UserAvatar || GetDefaultAvatar(user.Sex)} size="m" />
            )}
            <div className="info">
              {user && (
                <div className="user">
                  <NavLink to={`/profile/${user.Id}`} >
                    <h4>{user!.LastName} {user!.FirstName}</h4>
                  </NavLink> 
                  <span style={{margin: "0 5px"}}>предложил{user!.Sex === 2 ? 'a' : ''}</span>
                  <h4>{this.state.idea!.IdeaTitle}</h4>
                </div>
              )}
              <div className="description">
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {this.state.idea!.IdeaDescription}
                </pre>
              </div>
            </div>
            <div className="additional-info">
              <span className="create-date">
                {new Date(this.state.idea.CreateDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
              </span>
              <div className="scores">
                <div className="score-item">
                  <LabelWithHover text="Поддержало идею">
                    <i className="far fa-thumbs-up fa-2x"></i>
                  </LabelWithHover>
                  <span className="score-value">
                    {this.state.idea.VotesCount}
                  </span>
                </div>
                <div className="score-item">
                  <LabelWithHover text="Комментариев идеи">
                    <i className="fas fa-comment-dots fa-2x"></i>
                  </LabelWithHover>
                  <span className="score-value">
                    {this.state.idea.CountOfComments}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="button-container">
            {!this.state.isVoted && (
              <AcButton
                type="secondary"
                title="Поддержать идею"
                onClick={this.voteForIdea}
              />
            )}
            <AcButton
              type="secondary"
              title="Добавить комментарий"
            />
          </div>
        </div>
      </Page>
      ) || <div></div>
    )
  }

  @Autobind
  private loadIdea() {
    this.loadingService.changeLoader(true);
    this.projectService.getIdea(this.props.match.params.ideaId).then((idea: any) => {
      this.setState({ idea });
      this.loadingService.changeLoader(false);
      this.userService.$currentUser.subscribe((user: any) => {
        this.setState({ currentUser: user }, () => {
          this.projectService.isUserVoted({ userId: this.state.currentUser!.Id, ideaId: this.state.idea!.Id }).then((data: any) => {
            this.setState({ isVoted: data.isVoted });
          });
        });
      });
    });
  }

  @Autobind
  private voteForIdea() {
    this.projectService.voteForIdea({ userId: this.state.currentUser!.Id, ideaId: this.state.idea!.Id }).then(() => {
      this.toastService.changeEvent({ message: "Ваш голос принят", type: EventType.Success, show: true });
      this.loadIdea();
    }, () => this.toastService.changeEvent({ message: "Не удалось проголосвать за идею", type: EventType.Error, show: true }));
  }
}