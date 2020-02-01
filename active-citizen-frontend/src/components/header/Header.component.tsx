import React, { Component } from "react";

import "./Header.component.scss";
import { Logo } from "../logo/Logo.component";
import { AcButton } from "../common";
import { Autobind } from "../../helpers";
import { NavLink } from "react-router-dom";

export class Header extends Component {
  public render() {
    return (
      <header className="header">
        <div className="nav-container">
          <Logo />
          <nav className="navigation">
            <span className="navigation-item">Как это работает</span>
            <span className="navigation-item">Выполненные проекты</span>
          </nav>
          <div className="button-container">
            <NavLink to="/login">
              <AcButton
                isPrimary={false}
                title="Войти"
                onClick={this.handleLoginButtonClick}
              />
            </NavLink>
            <NavLink to="/signup">
              <AcButton
                isPrimary={false}
                title="Регистрация"
              />
            </NavLink>
          </div>
        </div>
      </header>
    )
  }

  @Autobind
  public handleLoginButtonClick() {
  }
}