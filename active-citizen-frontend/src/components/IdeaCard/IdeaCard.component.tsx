import React, { Component } from "react";
import { DirectionIdea } from "../../models";

import "./IdeaCard.component.scss";
import { UserAvatar } from "../UserAvatar";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";
import { DateFormatter } from "../../helpers";

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
          </div>
          <div className="description">
            <h4>{this.props.idea.IdeaTitle}</h4>
            {this.props.idea.IdeaDescription}
          </div>
        </div>
        <span className="create-date">
          {DateFormatter(this.props.idea.CreateDate, true)}
        </span>
      </div>
    )
  }
}