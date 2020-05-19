import React, { Component } from "react";
import { Page, AcLoader, AcInput, AcRadio, AcButton, AcEmptyState, UserAvatar } from "../../components";
import { FormInput } from "../../types";
import { requireValidationFunction } from "../../constants";
import { Autobind, GetDefaultAvatar } from "../../helpers";
import { User } from "../../models";
import { UserService, LoadingService } from "../../services";

import "./SearchUsers.page.scss";
import { Link } from "react-router-dom";

interface Props {}

interface State {
  input: FormInput;
  byFio: boolean;
  byEmail: boolean;
  isFormValid: boolean;
  searchResult: User[];
}

export class SearchUsers extends Component<Props, State> {
  public state: State = {
    searchResult: [],
    isFormValid: false,
    input: {
      validationFunctions: [requireValidationFunction],
      value: '',
      valid: false,
    },
    byFio: false,
    byEmail: false,
  }

  private userService: UserService;
  private loadingService: LoadingService;

  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
    this.loadingService = LoadingService.instance;
  }

  public render() {
    return (
      <Page title="Поиск пользователей">
        <AcLoader>
          <AcInput
            formInput={this.state.input}
            label="Фрагмент поиска"
            inputType="text"
            isRequired
            onChange={(value, isValid) => this.inputChange(value, isValid)}
          />
          <div>
            <AcRadio
              name="searchType"
              label="По ФИО"
              onCheck={() => this.onRadioCheck("byFio", ["byEmail"])}
            />
            <AcRadio
              name="searchType"
              label="По Email"
              onCheck={() => this.onRadioCheck("byEmail", ["byFio"])}
            />
          </div>
          <AcButton
            title="Поиск"
            type="primary"
            disabled={!this.state.isFormValid}
            onClick={this.searchUsers}
          />
          <div className="divider"></div>
          {this.state.searchResult.length && (
            this.state.searchResult.map((user, index) => (
              <div className="user-card" key={index}>
                <UserAvatar source={user.UserAvatar || GetDefaultAvatar(user.Sex)} size="s" />
                <div className="user-info">
                  <Link to={`/profile/${user.Id}`}>
                    <h4>{user.LastName} {user.FirstName} {user.Patronym}</h4>
                  </Link>
                  <span>{user.Email}</span>
                </div>
              </div>
            ))
          ) || <AcEmptyState text="Поиск не дал результатов" />}
        </AcLoader>
      </Page>
    );
  }

  @Autobind
  private inputChange(value: any, isValid: boolean) {
    this.setState({ input: { ...this.state.input, value, valid: isValid } }, () => this.validateForm());
  }

  @Autobind
  private onRadioCheck(fieldToCheck: string, fieldsToUnchek: string[]) {
    this.setState({ ...this.state, [fieldToCheck]: true }, () => {
      fieldsToUnchek.forEach(field => {
        this.setState({ ...this.state, [field]: false }, () => this.validateForm());
      });
    });
  }

  @Autobind
  private validateForm() {
    this.setState({ isFormValid: this.state.input.valid && (this.state.byFio || this.state.byEmail) });
  }

  @Autobind
  private searchUsers() {
    const searchType = this.state.byFio ? "FIO" : "EMAIL";
    this.loadingService.changeLoader(true);
    this.userService.searchUsers(searchType, this.state.input.value).then((data: any) => {
      this.setState({ searchResult: data });
      this.loadingService.changeLoader(false);
    }, error => {
      this.loadingService.changeLoader(false);
    });
  }
}