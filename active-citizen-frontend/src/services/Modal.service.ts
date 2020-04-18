import { BehaviorSubject } from 'rxjs';

export class ModalService {
  private static instanceInternal: ModalService;
  private isModalVisible: boolean = false;
  public $modalVisibilityChange = new BehaviorSubject<boolean>(false);
  
  public static get instance() {
    if (!ModalService.instanceInternal) {
      ModalService.instanceInternal = new ModalService();
    }

    return ModalService.instanceInternal;
  }

  public changeModalVisibility(value: boolean) {
    this.isModalVisible = value;
    this.$modalVisibilityChange.next(this.isModalVisible);
  }
}