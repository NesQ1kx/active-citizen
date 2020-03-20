import { BehaviorSubject } from 'rxjs';
export class LoadingService {
  private static instanceInternal: LoadingService;
  public $loaderChange = new BehaviorSubject<boolean>(false);

  public static get instance() {
    if (!LoadingService.instanceInternal) {
      LoadingService.instanceInternal = new LoadingService();
    }

    return LoadingService.instanceInternal;
  }

  public changeLoader(value: boolean) {
    this.$loaderChange.next(value);
  }

  private constructor () {}
}