export interface ToastEvent {
  show: boolean;
  type?: EventType;
  message?: string;
}

export enum EventType {
  Error = 1,
  Success = 2,
}