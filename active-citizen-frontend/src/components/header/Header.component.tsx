import React, { Component } from "react";
import { Logo } from "../logo/Logo.component";
import { AcButton } from "../common";
import { NavLink, RouteComponentProps  } from "react-router-dom";
import { UserService } from "../../services";
import { Autobind } from "../../helpers";

import "./Header.component.scss";

interface Props {}

interface State {
  isAuthenticated: boolean;
}

export class Header extends Component<Props> {
  public state: State = {
    isAuthenticated: false,
  };
  private userService: UserService;

  constructor(props: any) {
    super(props);
    this.userService = UserService.instance;
    this.userService.$currentUser.subscribe(user => {
      this.setState({ isAuthenticated: !!user });
    });
  }
  public render() {
    return (
      <header className="header">
        <nav className="nav-container">
          <div className="navigation-items">
            <Logo  />
            <span className="navigation-item">Как это работает</span>
            <span className="navigation-item">Выполненные проекты</span>
          </div>
          <div className="actions">
          {this.state.isAuthenticated
          ? 
            (<div className="button-container">
              <NavLink to="">
                <AcButton
                  type="secondary"
                  title="Профиль"
                />
              </NavLink>
              <NavLink to="">
                <AcButton
                  type="secondary"
                  title="Выйти"
                  onClick={this.signOut}
                />
              </NavLink>
            </div>)
          : (<div className="button-container">
              <NavLink to="/signin">
                <AcButton
                  type="secondary"
                  title="Войти"
                />
              </NavLink>
              <NavLink to="/signup">
                <AcButton
                  type="secondary"
                  title="Регистрация"
                />
              </NavLink>
            </div>)}
          </div>
        </nav>
      </header>
    )
  }

  @Autobind
  private signOut() {
    this.userService.singOunt().then(() => console.log("signout"));
  }
}