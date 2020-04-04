import { PROJECT } from './../constants/Endpoints.constant';
import { LoadProjectModel, UpdateProjectModel } from './../types/Form.types';
import { ToastService, HttpService } from ".";
import { EventType } from '../types';
import { Project } from '../models';
import { resolve } from 'dns';

export class ProjectService {
  private toastService = ToastService.instance;
  private httpService = HttpService.instance;
  private static instanceInternal: ProjectService;
  private projects: Project[] = []

  public static get instance() {
    if (!ProjectService.instanceInternal) {
      ProjectService.instanceInternal = new ProjectService();
    }

    return ProjectService.instanceInternal;
  }

  public loadProject(model: LoadProjectModel) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.LOAD, model)
      .then(() => {
        this.toastService.changeEvent({ show: true, message: "Проект успешно загружен", type: EventType.Success });
        resolve();
      })
    })
  }

  public getAllProjects() {
    return new Promise((resolve, reject) => {
      this.httpService.get(PROJECT.ALL).then((response) => {
        this.projects = response.data.Value;
        resolve(this.projects);
      }, (error) => {
        reject();
      });
    });
  }

  public getProjectById(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${PROJECT.BY_ID}/${id}`).then((response) => {
        resolve(response.data.Value);
      }, (error) => {
        reject(error);
      })
    })
  }

  public updateProject(model: UpdateProjectModel) {
    return new Promise((resolve, reject) => {
      this.httpService.put(PROJECT.UPDATE, model).then((response) => {
        resolve(response.data.Value);
      }, (error) => {
        reject(error);
      })
    })
  }

  public deleteProject(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.delete(`${PROJECT.DELETE}/${id}`).then((response) => {
        resolve();
      }, (error) => {
        reject(error);
      })
    })
  }

  public participate(ProjectId: number, UserId: number) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.PARTICIPATE, { ProjectId, UserId }).then(response => {
        resolve();
      }, error => {
        reject();
      })
    })
  }

  public isUserParticipate(ProjectId: number, UserId: number) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.IS_PARTICIPATE, { ProjectId, UserId }).then(response => {
        resolve(response.data.Value.isParicipate);
      }, error => {
        reject();
      })
    })
  }
}