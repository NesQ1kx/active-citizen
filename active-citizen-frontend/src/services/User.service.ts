import { BehaviorSubject } from 'rxjs';
import { HttpService } from './Http.service';
import { SignupModel, SiginModel } from './../types/Form.types';
import { ToastService } from './Toast.service';
import { EventType } from '../types';
import { USER } from '../constants/Endpoints.constant';
import { User } from '../models';

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
    this.httpService.post(USER.SIGNUP, model)
    .then(
      (response) => {
        this.toastService.changeEvent({ show: true, type: EventType.Success, message: "Регистрация прошла успешно" });
        localStorage.setItem("AccessToken", JSON.stringify({ value: response.data.Value.accessToken, email: response.data.Value.email }));
        this.getUserData(response.data.Value.email);
      },
      (error) => { this.toastService.changeEvent({ show: true, type: EventType.Error, message: error.response.data.Value.message })
    });
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
        (error) => { this.toastService.changeEvent({ show: true, type: EventType.Error, message: error.response.data.message })
      });
    })
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

  private constructor() {}
}