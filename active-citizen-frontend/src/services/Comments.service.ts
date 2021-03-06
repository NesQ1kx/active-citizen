import { ToastService } from '.';
import * as signalR from "@microsoft/signalr";
import { Subject } from "rxjs";
import { IdeaComment } from "../models/IdeaComment";
import { EventType } from '../types';

export class CommentsService {
  private static instanceInternal: CommentsService
  private toastService = ToastService.instance;
  private connection = new signalR.HubConnectionBuilder()
                      .withUrl("ws://localhost:24642/commentsHub" , {
                        skipNegotiation: true,
                        transport: signalR.HttpTransportType.WebSockets
                      })
                      .build();
  private comments$ = new Subject<IdeaComment>();
  private deletedComment$ = new Subject<any>();

  public static get instance() {
    if (!CommentsService.instanceInternal) {
      CommentsService.instanceInternal = new CommentsService();
    }
  
    return CommentsService.instanceInternal;
  }

  public connect() {
    this.connection.start().then(() => {
      this.connection.on("RecieveComment", (comment) => {
        this.comments$.next(JSON.parse(comment));
      });
      this.connection.on("ErrorWhileAdding", () => {
        this.toastService.changeEvent({ message: "Невозможно добавить комментарий", type: EventType.Error, show: true });
      });
      this.connection.on("SuccessfulAdd", () => {
        this.toastService.changeEvent({ message: "Комментарий добавлен", type: EventType.Success, show: true });
      });
      this.connection.on("DeletedComment", (deletedComment) => {
        this.deletedComment$.next(JSON.parse(deletedComment));
      });
      this.connection.on("SuccessfullDelete", () => {
        this.toastService.changeEvent({ message: "Комментарий удалён", type: EventType.Success, show: true });
      });
      this.connection.on("ErrorWhileDeleting", () => {
        this.toastService.changeEvent({ message: "Невозможно удалить комментарий", type: EventType.Error, show: true });
      });
    }).catch(err => console.log(err));
  }

  public getComment() {
    return this.comments$.asObservable();
  }

  public onDeleteComment() {
    return this.deletedComment$.asObservable();
  }

  public sendComment(comment: IdeaComment) {
    this.connection.invoke("SendComment", comment);
  }

  public deleteComment(commentToDelete: any) {
    this.connection.invoke("DeleteComment", commentToDelete);
  }
}