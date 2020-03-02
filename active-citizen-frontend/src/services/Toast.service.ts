import { ToastEvent } from './../types/Toast.types';
import { BehaviorSubject } from "rxjs";

export class ToastService {
  private static instanceInternal: ToastService;
  public toastEventChange = new BehaviorSubject<ToastEvent>({ show: false });

  public static get instance() {
    if (!ToastService.instanceInternal) {
      ToastService.instanceInternal = new ToastService();
    }

    return ToastService.instanceInternal;
  }

  public changeEvent(event: ToastEvent) {
    this.toastEventChange.next(event);
  }

  private constructor () {}
}