import React, { Component } from "react";
import { IdeaComment } from "../../models/IdeaComment";

import "./Comment.component.scss";
import { UserAvatar } from "../UserAvatar";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";
import { AcModal, AcButton } from "../common";
import { AddCommentModal } from "../AddCommentModal";
import { Autobind } from "../../helpers";
import { ModalService, CommentsService, UserService } from "../../services";
import { User } from "../../models";

interface Props {
  comment: IdeaComment;
  parentComments: IdeaComment[];
}

interface State {
  currentUser?: User;
}

export class Comment extends Component<Props, State> {
  public state: State = {
    currentUser: undefined,
  }
  private modalService: ModalService;
  private commentsService: CommentsService;
  private userService: UserService;

  constructor(props: Props) {
    super(props);
    this.modalService = ModalService.instance;
    this.commentsService = CommentsService.instance;
    this.userService = UserService.instance;
  }

  public componentDidMount() {
    this.userService.$currentUser.subscribe((user: any) => {
      user && this.setState({ currentUser: user });
    });
  }

  public render() {
    const user = this.props.comment.User;
    return (
      <div>
        <div className="comment">
          <div className="block">
            <UserAvatar source={user!.UserAvatar || GetDefaultAvatar(user!.Sex)} size="s" />
            <div className="info">
              <h4>{user!.LastName} {user!.FirstName}</h4>
              <div className="text">{this.props.comment.CommentText}</div>
              {!this.props.comment.ParrentComment && (
                <span className="link" onClick={this.openAddCommentModal} >Ответить</span>
              )}
            </div>
          </div>
          <div className="create-date">
            {new Date(this.props.comment.CreateDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
          </div>
        </div>
        <div className="child-comments">
          {this.props.parentComments.map((item, index) => <Comment comment={item} key={index} parentComments={[]} /> )}
        </div>
      </div>
    );
  }

  @Autobind
  private openAddCommentModal() {
    this.modalService.changeModalVisibility(true, { title: "Ответить на комментарий", body: (<AddCommentModal onAddComment={(commentText) => this.addComment(commentText)} />) });
  }

  @Autobind addComment(commentText: string) {
    const comment: IdeaComment = {
      CommentText: commentText,
      CreateDate: Date.now(),
      IdeaId: this.props.comment.IdeaId,
      UserId: this.state.currentUser!.Id,
      ParrentComment: this.props.comment.Id,
      ChildComments: [],
    }

    console.log(comment);
    this.commentsService.sendComment(comment);
    this.modalService.changeModalVisibility(false);
  }
}