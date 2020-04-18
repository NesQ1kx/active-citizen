import React, { Component } from "react";
import { DirectionIdea } from "../../models";

import "./IdeaCard.component.scss";
import { UserAvatar } from "../UserAvatar";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";

interface Props {
  idea: DirectionIdea;
}

export class IdeaCard extends Component<Props> {
  public render() {
    const { User } = this.props.idea;
    return (
      <div className="idea-card">
        <UserAvatar source={User!.UserAvatar || GetDefaultAvatar(User!.Sex)} size="s"/>
        <div className="info">
          <div className="user">
            <h4>{User!.LastName} {User!.FirstName}</h4> 
            <span style={{margin: "0 5px"}}>предложил{User!.Sex === 2 ? 'a' : ''}</span>
            <h4>{this.props.idea.IdeaTitle}</h4>
          </div>
          <div className="description">{this.props.idea.IdeaDescription}</div>
        </div>
        <span className="create-date">
          {new Date(this.props.idea.CreateDate).toLocaleString('ru', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
        </span>
      </div>
    )
  }
}