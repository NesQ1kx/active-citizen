import React, { Component } from "react";
import { Page, UserAvatar } from "../../components";
import { User } from "../../models";
import { UserService } from "../../services";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";

import "./Profile.page.scss";

interface Props {
  match: any;
}

interface State {
  profileUser?: User;
  currentUser?: User;
}

export class ProfilePage extends Component<Props, State> {
  private userService: UserService;
  public state: State = {
    currentUser: undefined,
    profileUser: undefined,
  }
  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
  }

  public componentDidMount() {
    this.userService.$currentUser.subscribe((user: any) => {
      this.setState({ currentUser: user }, () => {
        if (this.state.currentUser && (+this.props.match.params.userId === this.state.currentUser.Id)) {
          this.setState({ profileUser: this.state.currentUser });
        }
      });
    });
  }

  public render() {
    return (
      <Page title="Профиль">
        {this.state.profileUser && (
          <div className="user-profile">
            <div className="user-info">
              <UserAvatar source={this.state.currentUser!.UserAvatar || GetDefaultAvatar(this.state.profileUser!.Sex)} size="m"/>
              <h3>{this.state.profileUser!.LastName} {this.state.profileUser!.FirstName} {this.state.profileUser!.Patronym}</h3>
            </div> 
          </div>
        )}
      </Page>
    )
  }
}