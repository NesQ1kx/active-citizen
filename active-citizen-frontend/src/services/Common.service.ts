import { COMMON } from './../constants/Endpoints.constant';
import { AddNewsModel } from './../types/Form.types';
import { HttpService } from ".";
import { resolve } from 'path';
import { News } from '../models/News';

export class CommonService {
  private static instanceInternal: CommonService;
  private httpService = HttpService.instance;


  public static get instance() {
    if (!CommonService.instanceInternal) {
      CommonService.instanceInternal = new CommonService();
    }

    return CommonService.instanceInternal;
  }

  public addNews(model: AddNewsModel) {
    return new Promise((resolve, reject) => {
      this.httpService.post(COMMON.ADD_NEWS, model).then(() => {
        resolve();
      }, error => reject());
    });
  }

  public getAllNews() {
    return new Promise((resolve, reject) => {
      this.httpService.get(COMMON.GET_ALL_NEWS).then((response) => {
        resolve(response.data.Value);
      }, error => reject());
    });
  }

  public getNewsById(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${COMMON.GET_NEWS}/${id}`).then(response => {
        resolve(response.data.Value);
      }, error => reject());
    });
  }

  public deleteNews(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${COMMON.DELETE_NEWS}/${id}`).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public updateNews(news: News) {
    return new Promise((resolve, reject) => {
      this.httpService.put(COMMON.EDIT_NEWS, news).then(() => {
        resolve();
      }, error => reject());
    });
  }
}