import React, { Component } from "react";
import { IdeaComment } from "../../models/IdeaComment";

import "./Comment.component.scss";
import { UserAvatar } from "../UserAvatar";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";

interface Props {
  comment: IdeaComment;
  parentComments?: IdeaComment[];
}

export class Comment extends Component<Props> {
  public render() {
    const user = this.props.comment.User;
    return (
      <div className="comment">
        <UserAvatar source={user!.UserAvatar || GetDefaultAvatar(user!.Sex)} size="s" />
        <div className="info">
          <h4>{user!.LastName} {user!.FirstName}</h4>
          <div className="text">{this.props.comment.CommentText}</div>
        </div>
        <div className="create-date">
          {new Date(this.props.comment.CreateDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
        </div>
      </div>
    );
  }
}