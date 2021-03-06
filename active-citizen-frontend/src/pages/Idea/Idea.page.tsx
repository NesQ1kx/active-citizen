import React, { Component } from "react";
import { Page, AcButton, UserAvatar, LabelWithHover, AcEmptyState, AcModal, AddCommentModal, Comment } from "../../components";
import { ProjectService, UserService, LoadingService, ToastService, CommentsService, ModalService } from "../../services";
import { DirectionIdea, User, Roles } from "../../models";

import "./Idea.page.scss";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";
import { NavLink } from "react-router-dom";
import { Autobind, GetProjectPhase } from "../../helpers";
import { EventType } from "../../types";
import { IdeaComment } from "../../models/IdeaComment";

interface Props {
  match: any;
}

interface State {
  idea?: DirectionIdea;
  currentUser?: User;
  isVoted: boolean;
  ideaComments: IdeaComment[];
  countOfComments: number;
}

export class Idea extends Component<Props, State> {
  public state: State = {
    idea: undefined,
    currentUser: undefined,
    isVoted: false,
    ideaComments: [],
    countOfComments: 0,
  }
  private projectService: ProjectService;
  private userService: UserService;
  private loadingService: LoadingService;
  private toastService: ToastService;
  private commentsService: CommentsService;
  private modalService: ModalService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.userService = UserService.instance;
    this.loadingService = LoadingService.instance;
    this.toastService = ToastService.instance;
    this.commentsService = CommentsService.instance;
    this.modalService = ModalService.instance;
  }

  public componentDidMount() {
    this.loadIdea();
    this.commentsService.connect();
    this.commentsService.getComment().subscribe(comment => {
      if (comment.IdeaId === this.state.idea!.Id) {
        const comments = this.state.ideaComments;
        comments.push(comment);
        const countOfComments = this.state.countOfComments + 1
        this.setState({ ideaComments: comments, countOfComments });
      }
    });
    this.commentsService.onDeleteComment().subscribe(deletedComment => {
      if (this.state.idea!.Id === deletedComment.IdeaId) {
        const comments = this.state.ideaComments;
        const countOfComments = this.state.countOfComments - 1;
        this.setState({ ideaComments: comments.filter(c => c.Id !== deletedComment.CommentId), countOfComments });
      }
    })
  }

  public render() {
    const user = this.state.idea && this.state.idea.User;
    return (
      this.state.idea && (
        <Page title="">
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
                </div>
              )}
              <div className="description">
                <h4>{this.state.idea!.IdeaTitle}</h4>
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
                    {this.state.countOfComments}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="button-container">
            {!this.state.isVoted && GetProjectPhase(this.state.idea!.Direction!.Project) === "VOTING" && (
              <AcButton
                type="secondary"
                title="Поддержать идею"
                onClick={this.voteForIdea}
              />
            )}
            <AcButton
              type="secondary"
              title="Добавить комментарий"
              onClick={this.openAddCommentModal}
            />
          </div>
          <div className="divider"></div>
          <div className="comments-block">
            {this.state.ideaComments.length 
              ? (this.state.ideaComments.map((item, index) => (
                !item.ParrentComment && <Comment onDeleteComment={(id) => this.deleteComment(id)} comment={item} key={index} parentComments={this.state.ideaComments.filter(comment => comment.ParrentComment === item.Id)} />
              )))
              : (<AcEmptyState text="Пока что никто не оставлял комментариев." />)
            }
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
      this.setState({ idea }, () => this.setState({ ideaComments: this.state.idea!.IdeaComment!, countOfComments: this.state.idea!.CountOfComments }));
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

  @Autobind
  private openAddCommentModal() {
    this.modalService.changeModalVisibility(true, { title: "Добавить комментарий", body: (<AddCommentModal onAddComment={(commentText) => this.addComment(commentText)} />) });
  }

  @Autobind addComment(commentText: string) {
    const comment: IdeaComment = {
      CommentText: commentText,
      CreateDate: Date.now(),
      IdeaId: this.state.idea!.Id,
      UserId: this.state.currentUser!.Id,
      ChildComments: [],
    }
    this.commentsService.sendComment(comment);
    this.modalService.changeModalVisibility(false);
  }

  @Autobind
  private deleteComment(commentId: number) {
    this.commentsService.deleteComment({ CommentId: commentId, IdeaId: this.state.idea!.Id });
  }
}