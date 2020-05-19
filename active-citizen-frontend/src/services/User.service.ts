import { BehaviorSubject } from 'rxjs';
import { HttpService } from './Http.service';
import { SignupModel, SiginModel, EditUserProfileModel } from './../types/Form.types';
import { ToastService } from './Toast.service';
import { EventType } from '../types';
import { USER } from '../constants/Endpoints.constant';
import { User } from '../models';
import { resolve } from 'path';

export class UserService {
  private static instanceInternal: UserService;
  private toastService = ToastService.instance;
  private httpService = HttpService.instance;
  private currentUser: User | undefined;
  public $currentUser = new BehaviorSubject<User | undefined>(this.currentUser);

  public static get instance() {
    if (!UserService.instanceInternal) {
      UserService.instanceInternal = new UserService();
    }

    return UserService.instanceInternal;
  }

  public signup(model: SignupModel) {
    return new Promise((resolve, reject) => {
      this.httpService.post(USER.SIGNUP, model)
      .then(
        (response) => {
          // this.toastService.changeEvent({ show: true, type: EventType.Success, message: "Регистрация прошла успешно" });
          // localStorage.setItem("AccessToken", JSON.stringify({ value: response.data.Value.accessToken, email: response.data.Value.email }));
          // this.getUserData(response.data.Value.email);
          resolve();
        },
        (error) => { this.toastService.changeEvent({ show: true, type: EventType.Error, message: error.response.data.Value.message })
      });
    })
  }

  public signin(model: SiginModel) {
    return new Promise((resolve, reject) => {
      this.httpService.post(USER.SIGNIN, model)
      .then(
        (response) => {
          this.toastService.changeEvent({ show: true, type: EventType.Success, message: "Вы успешно вошли в систему" });
          localStorage.setItem("AccessToken", JSON.stringify({ value: response.data.Value.accessToken, email: response.data.Value.email }));
          this.getUserData(response.data.Value.email);
          resolve();
        },
        (error) => {
          this.toastService.changeEvent({ show: true, type: EventType.Error, message: error.response.data.message });
          reject();
      });
    })
  }

  public confirmEmail(token: string) {
    return new Promise((resolve, reject) => {
      this.httpService.post(USER.CONFIRM_EMAIL, { Token: token }).then(response => {
        this.toastService.changeEvent({ show: true, type: EventType.Success, message: "Регистрация завершена" });
        localStorage.setItem("AccessToken", JSON.stringify({ value: response.data.Value.accessToken, email: response.data.Value.email }));
        this.getUserData(response.data.Value.email);
        resolve();
      }, error => reject());
    });
  }

  public singOunt() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem("AccessToken");
      this.currentUser = undefined;
      this.$currentUser.next(this.currentUser);
      resolve();
    })
  }

  public getUserData(email: string) {
    this.httpService.get(`${USER.GET_USER_DATA}/${email}`).then((reposnse) => {
      this.currentUser = reposnse.data.Value;
      this.$currentUser.next(this.currentUser);
    });
  }

  public getUserById(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${USER.GET_USER_BY_ID}/${id}`).then(response => {
        resolve(response.data.Value);
      }, error => reject());
    });
  }

  public notifyUsersAboutProjectStart(projectId: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${USER.NOTIFY}/${projectId}`).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public updateUserRole(userId: number, role: number) {
    return new Promise((resolve, reject) => {
      this.httpService.put(USER.UPDATE_USER, { UserId: userId, Role: role }).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public toggleUserBlock(userId: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${USER.TOGGLE_BLOCK}/${userId}`).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public updateUserAvatar(userId: number, avatar: string) {
    return new Promise((resolve, reject) => {
      this.httpService.put(USER.UPDATE_AVATAR, { UserId: userId, Avatar: avatar }).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public deleteUserAvatar(userId: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${USER.DELETE_AVATAR}/${userId}`).then(response => {
        resolve();
      }, error => reject());
    });
  }

 public editUserProfile(model: EditUserProfileModel) {
   return new Promise((resolve, reject) => {
     this.httpService.put(USER.EDIT_PROFILE, model).then(response => {
      resolve();
     }, error => reject());
   });
 }

 public searchUsers(searchType: string, fragment: string) {
   return new Promise((resolve, reject) => {
     this.httpService.post(USER.SEARCH_USERS, { SearchType: searchType, Fragment: fragment }).then(response => {
       resolve(response.data.Value);
     }, error => reject());
   });
 }

  private constructor() {}
}