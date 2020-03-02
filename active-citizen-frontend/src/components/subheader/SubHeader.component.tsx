import React, { Component } from "react";
import { UserService } from "../../services";

import "./SubHeader.component.scss";
import { User } from "../../models";
import { NavLink } from "react-router-dom";
import { Roles } from "../../models/Roles";

interface State {
  isAuthenticated: boolean;
  currentUser?: User;
}

export class SubHeader extends Component {
  public state: State = {
    isAuthenticated: false,
    currentUser: undefined,
  }
  private userService: UserService;

  constructor(props: any) {
    super(props);
    this.userService = UserService.instance;
    this.userService.$currentUser.subscribe(user => {
      this.setState({ isAuthenticated: !!user, currentUser: user });
    });
  }
  public render() {
    return (
      this.state.isAuthenticated && (
        <header className="sub-header">
        <div className="nav-container">
          <NavLink activeClassName="active-link" to="propose-idea" className="sub-nav-item">Разместить идею</NavLink>
          <NavLink activeClassName="active-link" to="current-projects" className="sub-nav-item">Текущие проекты</NavLink>
          {this.state.currentUser!.Role === Roles.Admin && (
            <NavLink activeClassName="active-link" to="load-project" className="sub-nav-item">Загрузить проект</NavLink>
          )}
        </div>
      </header>
      )
    )
  } 
}