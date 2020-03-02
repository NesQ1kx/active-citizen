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
        <div className="nav-container">
          <Logo />
          <nav className="navigation">
            <span className="navigation-item">Как это работает</span>
            <span className="navigation-item">Выполненные проекты</span>
          </nav>
          {this.state.isAuthenticated
          ? 
            (<div className="button-container">
              <NavLink to="">
                <AcButton
                  isPrimary={false}
                  title="Профиль"
                />
              </NavLink>
              <NavLink to="">
                <AcButton
                  isPrimary={false}
                  title="Выйти"
                  onClick={this.signOut}
                />
              </NavLink>
            </div>)
          : (<div className="button-container">
              <NavLink to="/signin">
                <AcButton
                  isPrimary={false}
                  title="Войти"
                />
              </NavLink>
              <NavLink to="/signup">
                <AcButton
                  isPrimary={false}
                  title="Регистрация"
                />
              </NavLink>
            </div>)}
        </div>
      </header>
    )
  }

  @Autobind
  private signOut() {
    this.userService.singOunt().then(() => console.log("signout"));
  }
}