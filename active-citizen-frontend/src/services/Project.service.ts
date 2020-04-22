import { DirectionIdea } from './../models/DirectionIdea';
import { PROJECT } from './../constants/Endpoints.constant';
import { LoadProjectModel, UpdateProjectModel, AddIdeaModel } from './../types/Form.types';
import { ToastService, HttpService } from ".";
import { EventType } from '../types';
import { Project } from '../models';
import { resolve } from 'dns';
import { reject } from 'q';

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

  public getDirectionById(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${PROJECT.GET_DIRECTION}/${id}`).then(response => {
        resolve(response.data.Value);
      }, error => reject());
    })
  }

  public addIdea(model: AddIdeaModel) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.ADD_IDEA, model).then(response => {
        resolve();
      }, error => reject());
    })
  }

  public getIdeas(directionId: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${PROJECT.GET_IDEAS}/${directionId}`).then(response => {
        resolve(response.data.Value);
      }, error => reject());
    });
  }

  public updateIdea(idea: DirectionIdea) {
    return new Promise((resolve, reject) => {
      this.httpService.put(PROJECT.UPDATE_IDEA, idea).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public getIdea(id: number) {
    return new Promise((resolve, reject) => {
      this.httpService.get(`${PROJECT.GET_IDEA}/${id}`).then(response => {
        resolve(response.data.Value);
      }, error => reject());
    });
  }

  public voteForIdea(voting: any) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.VOTE, { UserId: voting.userId, IdeaId: voting.ideaId }).then(response => {
        resolve();
      }, error => reject());
    });
  }

  public isUserVoted(voting: any) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.IS_VOTED, { UserId: voting.userId, IdeaId: voting.ideaId }).then(response => {
        resolve(response.data.Value);
      }, error => reject());
    });
  }
}