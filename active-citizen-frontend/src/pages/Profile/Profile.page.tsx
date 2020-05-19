import React, { Component } from "react";
import { Page, UserAvatar, AcButton, AcInput, AcDropDown, AcLoader, EditAvatarModal, EditProfileModal } from "../../components";
import { User, Roles } from "../../models";
import { UserService, LoadingService, ToastService, ModalService } from "../../services";
import { GetDefaultAvatar } from "../../helpers/GetDefaultAvatar.helper";

import "./Profile.page.scss";
import { FormInput, EventType, EditUserProfileModel } from "../../types";
import { Autobind, DateFormatter } from "../../helpers";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { districts } from "../SignupPage/Constants";

const rolesList = [
  {
    key: 1,
    value: "Пользователь"
  },
  {
    key: 2,
    value: "Эксперт"
  },
  {
    key: 3,
    value: "Администратор"
  },
]
 
interface Props {
  match: any;
}

interface State {
  profileUser?: User;
  currentUser?: User;
  userRole: FormInput;
  hovered: boolean;
}

export class ProfilePage extends Component<Props, State> {
  public state: State = {
    hovered: false,
    currentUser: undefined,
    profileUser: undefined,
    userRole: {
      validationFunctions: [],
      valid: true,
      value: '',
    }
  }

  private userService: UserService;
  private loadingService: LoadingService;
  private toastService: ToastService;
  private modalService: ModalService;

  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
    this.loadingService = LoadingService.instance;
    this.toastService = ToastService.instance;
    this.modalService = ModalService.instance;
  }

  public componentDidMount() {
    this.loadUser();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.match.params.userId !== this.props.match.params.userId) {
      this.loadUser();
    }
  }

  public render() {
    const isOwnProfile = this.state.currentUser && this.state.profileUser && this.state.currentUser.Id === this.state.profileUser.Id;
    const profileUser = this.state.profileUser;
    const currentUser = this.state.currentUser;
    return (
      <Page title="Профиль">
        <AcLoader>
        {profileUser && (
          <div className="user-profile">
            <div className="user-info">
              <div
                className="avatar"
                onMouseOver={() => this.setState({ hovered: true })}
                onMouseOut={() => this.setState({ hovered: false })}
              >
                <UserAvatar source={profileUser.UserAvatar || GetDefaultAvatar(profileUser.Sex)} size="m"/>
                <ReactCSSTransitionGroup
                  transitionName="avatar"
                  transitionEnter={true}
                  transitionAppear={false}
                  transitionLeave={true}
                >
                  {isOwnProfile && this.state.hovered && (
                  <div
                    className="overlay"
                    onClick={this.openEditAvatarModal}
                  >
                    Редактировать
                  </div>
                )}
                </ReactCSSTransitionGroup>
                
              </div>
              <div className="info">
                <h3>{profileUser.LastName} {profileUser.FirstName} {profileUser.Patronym}</h3>
                <span className="role">{rolesList.find(r => r.key === profileUser.Role)!.value}</span>
                {(isOwnProfile || (currentUser && currentUser.Role === Roles.Admin)) && (
                  <div className="user-details">
                    <div className="info-row">
                      E-mail: <span>{profileUser.Email}</span>
                    </div>
                    <div className="info-row">
                      Район: <span>{districts.find(d => d.key === profileUser.District)!.value}</span>
                    </div>
                    {isOwnProfile && (
                      <div className="info-row">
                        СНИЛС: <span>{profileUser.Snils}</span>
                      </div>
                    )}
                    <div className="info-row">
                      Дата рождения: <span>{DateFormatter(profileUser.DateOfBirth)}</span>
                    </div>
                  </div>
                ) }
              </div>
              <div className="actions">
               {isOwnProfile && (
                  <AcButton
                    type="primary"
                    title="Редактировать"
                    onClick={this.openEditProfileModal}
                  />
               )}
               {currentUser && !isOwnProfile && currentUser.Role === Roles.Admin && (
                 <div>
                   <AcButton
                    type={profileUser.IsBlocked ? "positive" : "negative"}
                    title={profileUser.IsBlocked ? "Разблокировать" : "Заблокировать"}
                    onClick={this.toggleUserBlock}
                  />
                  <AcDropDown
                    list={rolesList}
                    formInput={this.state.userRole}
                    onChange={(value) => this.onInputChange(value)}
                  />
                 </div>
               )}
              </div>
            </div>
            <div className="divider"></div>
          </div>
        )}
        </AcLoader>
      </Page>
    )
  }

  @Autobind
  private loadUser() {
    this.loadingService.changeLoader(true);
    this.userService.$currentUser.subscribe((user: any) => {
      this.setState({ currentUser: user }, () => {
        if (this.state.currentUser && (+this.props.match.params.userId === this.state.currentUser.Id)) {
          this.setState({
            profileUser: this.state.currentUser,
            userRole: { ...this.state.userRole, value: rolesList.find(i => i.key === this.state.currentUser!.Role) } }, () => this.forceUpdate());
        } else {
          this.userService.getUserById(this.props.match.params.userId).then((profileUser: any) => {
            this.setState({
              profileUser,
              userRole: { ...this.state.userRole, value: rolesList.find(i => i.key === profileUser.Role) } }, () => this.forceUpdate());
          });
        }
        this.loadingService.changeLoader(false);
      });
    });
  }

  @Autobind
  private onInputChange(item: any) {
    this.userService.updateUserRole(this.state.profileUser!.Id, item.key).then(() => {
      this.toastService.changeEvent({ message: "Роль обновлена", type: EventType.Success, show: true });
      this.loadUser();
    }, () => this.toastService.changeEvent({ message: "Невозможно обновить роль", type: EventType.Error, show: true }));
  }

  @Autobind
  private toggleUserBlock() {
    this.userService.toggleUserBlock(this.state.profileUser!.Id).then(() => {
      this.toastService.changeEvent({ message: "Успешно", type: EventType.Success, show: true });
      this.loadUser();
    }, () => this.toastService.changeEvent({ message: "Невозможно выполнить операцию", type: EventType.Error, show: true }));
  }

  @Autobind
  private openEditAvatarModal() {
    this.modalService.changeModalVisibility(true, {
      title: "Редактирование изображения",
      body: <EditAvatarModal onUpdate={(value) => this.onUpdateAvatar(value)} onDelete={this.onDeleteAvatar}/>
    });
  }

  @Autobind
  private onUpdateAvatar(avatar: string) {
    this.userService.updateUserAvatar(this.state.profileUser!.Id, avatar).then(() => {
      this.toastService.changeEvent({ message: "Изображение обновлено", type: EventType.Success, show: true });
      this.modalService.changeModalVisibility(false);
      this.userService.getUserData(this.state.profileUser!.Email);
    }, () => {
      this.toastService.changeEvent({ message: "Не удалось обновить изображение", type: EventType.Error, show: true });
    });
  }

  @Autobind
  private onDeleteAvatar() {
    this.userService.deleteUserAvatar(this.state.profileUser!.Id).then(() => {
      this.toastService.changeEvent({ message: "Изображение удалено", type: EventType.Success, show: true });
      this.modalService.changeModalVisibility(false);
      this.userService.getUserData(this.state.profileUser!.Email);
    }, () => {
      this.toastService.changeEvent({ message: "Не удалось удалить изображение", type: EventType.Error, show: true });
    });
  }

  @Autobind
  private openEditProfileModal() {
    this.modalService.changeModalVisibility(true, {
      title: "Редакитрование профиля",
      body: <EditProfileModal user={this.state.profileUser!} onSave={(model) => this.onSaveProfile(model)} />
    });
  }

  @Autobind
  private onSaveProfile(model: EditUserProfileModel) {
    this.userService.editUserProfile(model).then(() => {
      this.toastService.changeEvent({ message: "Профиль обновлён", type: EventType.Success, show: true });
      this.modalService.changeModalVisibility(false);
      this.userService.getUserData(this.state.profileUser!.Email);
    }, () => {
      this.toastService.changeEvent({ message: "Не удалось обновить профиль", type: EventType.Error, show: true });
    });
  }
}