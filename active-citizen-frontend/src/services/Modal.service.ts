import { BehaviorSubject, Subject } from 'rxjs';
import { ModalContent } from '../types';

export class ModalService {
  private static instanceInternal: ModalService;
  public $modalVisibilityChange = new Subject<ModalContent | undefined>();
  
  public static get instance() {
    if (!ModalService.instanceInternal) {
      ModalService.instanceInternal = new ModalService();
    }

    return ModalService.instanceInternal;
  }

  public changeModalVisibility(value: boolean, content?: ModalContent) {
    this.$modalVisibilityChange.next(value ? content : undefined);
  }
}