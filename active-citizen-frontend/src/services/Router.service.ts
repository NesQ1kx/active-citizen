import { Subject } from "rxjs";

export class RouterService {
  private static instanceInternal: RouterService;
  public $routeChange = new Subject<string>();

  public static get instance() {
    if (!RouterService.instanceInternal) {
      RouterService.instanceInternal = new RouterService();
    }

    return RouterService.instanceInternal;
  }

  public redirect(route?: string) {
    this.$routeChange.next(route);
  }
}