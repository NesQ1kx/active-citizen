import { RouterService } from './Router.service';
import { LoadingService } from './Loading.service';
import { UserService } from './User.service';
import { EventType } from './../types/Toast.types';
import axios from "axios";
import { ToastService } from "./Toast.service";

function axiosInstance() {
  const axiosInstance = axios;
  axiosInstance.interceptors.response.use(response => {
    return response;
  }, error => {
    LoadingService.instance.changeLoader(false);

    if (!error.response) {
      ToastService.instance.changeEvent({ show: true, type: EventType.Error, message: "Ошибка сервера" });
      return Promise.reject({ ...error, response: { data: { message: "Ошибка сервера" } } });
    }

    if (error.response.status === 401) {
      localStorage.removeItem("AccessToken");
      ToastService.instance.changeEvent({ show: true, type: EventType.Error, message: "Необхоима аутентификация" });
      UserService.instance.$currentUser.next(undefined);
      RouterService.instance.redirect("/signin");
    }
    
    return Promise.reject(error);
  });
  return axiosInstance;
}

export class HttpService {
  private static instanceInternal: HttpService;
  private axiosInstance = axiosInstance();

  public static get instance() {
    if (!HttpService.instanceInternal) {
      HttpService.instanceInternal = new HttpService();
    }

    return HttpService.instanceInternal;
  }

  public get(url: string,) {
    return this.axiosInstance.get(url, { headers: this.getRequestConfig() });
  }

  public post(url: string, payload: any) {
    return this.axiosInstance.post(url, payload, { headers: this.getRequestConfig() });
  }

  public put(url: string, payload: any) {
    return this.axiosInstance.put(url, payload, { headers: this.getRequestConfig() });
  }

  public delete(url: string) {
    return this.axiosInstance.delete(url, { headers: this.getRequestConfig() });
  }

  private getRequestConfig() {
    const userInfo = JSON.parse(localStorage.getItem("AccessToken")!);
    return {
      "Authorization": `Bearer ${userInfo ? userInfo.value : ''}`
    };
  }

  private constructor() {}
}