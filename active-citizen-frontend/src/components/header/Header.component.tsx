import React, { Component } from "react";
import { Logo } from "../logo/Logo.component";
import { AcButton } from "../common";
import { NavLink, RouteComponentProps  } from "react-router-dom";
import { UserService } from "../../services";
import { Autobind } from "../../helpers";

import "./Header.component.scss";
import { User, Roles } from "../../models";

interface Props {}

interface State {
  isAuthenticated: boolean;
  currentUser?: User;
  isDropDownVisible: boolean;
}

export class Header extends Component<Props> {
  public state: State = {
    isAuthenticated: false,
    isDropDownVisible: false,
  };
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
      <header className="header">
        <nav className="nav-container">
          <div className="navigation-items">
            <Logo  />
            <NavLink to="" className="navigation-item">Как это работает</NavLink>
            <NavLink to="/finished-projects" activeClassName="active-link" className="navigation-item">Завершённые проекты</NavLink>
            <NavLink to="/current-projects" activeClassName="active-link" className="navigation-item">Текущие проекты</NavLink>
            {this.state.isAuthenticated && this.state.currentUser!.Role === Roles.Admin && (
              <div className="navigation-item with-drop-down"
                   onMouseOver={() => this.setState({ isDropDownVisible: true })}
                   onMouseLeave={() => this.setState({ isDropDownVisible: false })}
                   >
                Администратор
               {this.state.isDropDownVisible && (
                  <div className="drop-down">
                    <NavLink to="/load-project" className="navigation-item" activeClassName="active-link">Загрузить проект</NavLink>
                    <NavLink to="" className="navigation-item">Найти пользователя</NavLink>
                    <NavLink to="/add-news" className="navigation-item">Добавить новость</NavLink>
                  </div>
               )}
              </div>
            )}
          </div>
          <div className="actions">
          {this.state.isAuthenticated
          ? 
            (<div className="button-container">
              <NavLink to={`/profile/${this.state.currentUser!.Id}`}>
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