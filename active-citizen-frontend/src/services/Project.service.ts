import { PROJECT } from './../constants/Endpoints.constant';
import { LoadProjectModel } from './../types/Form.types';
import { ToastService, HttpService } from ".";

export class ProjectService {
  private toastService = ToastService.instance;
  private httpService = HttpService.instance;
  private static instanceInternal: ProjectService;

  public static get instance() {
    if (!ProjectService.instanceInternal) {
      ProjectService.instanceInternal = new ProjectService();
    }

    return ProjectService.instanceInternal;
  }

  public LoadProject(model: LoadProjectModel) {
    return new Promise((resolve, reject) => {
      this.httpService.post(PROJECT.LOAD, model)
    })
  }
}