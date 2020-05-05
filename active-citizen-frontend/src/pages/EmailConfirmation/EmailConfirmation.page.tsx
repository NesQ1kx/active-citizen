import React, { Component } from "react";
import { Page } from "../../components/common";

import "./EmailConfirmation.page.scss";

export class EmailConfirmation extends Component {
  public render() {
    return (
      <Page title="Завершение регистрации" width="440">
        <div className="email-confirmation">
          <i className="fas fa-envelope-open-text fa-5x"></i>
          <span className="text">
            Для заверешния регистрации следуйте инструкциям в письме, которое мы выслали Вам на почту
          </span>
        </div>
      </Page>
    );
  }
}