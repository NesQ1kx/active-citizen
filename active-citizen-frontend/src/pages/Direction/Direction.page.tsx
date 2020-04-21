import React, { Component } from "react";
import { Page, AcLoader, AcButton, AcModal, ProposeIdeaModal, AcEmptyState, IdeaCard, AcAlert } from "../../components";
import { ProjectService, LoadingService, ToastService, ModalService, UserService } from "../../services";
import { ProjectDirection, User, Roles, DirectionIdea } from "../../models";

import "./Direction.page.scss"
import { Autobind } from "../../helpers";
import { AddIdeaModel, EventType } from "../../types";
import { Redirect } from "react-router";
import { RouterService } from "../../services/Router.service";

interface Props {
  match: any;
}

interface State {
  direction?: ProjectDirection;
  currentUser?: User;
  isUserParticipate: boolean;
}

export class Direction extends Component<Props, State> {
  public state: State = {
    direction: undefined,
    isUserParticipate: false,
  }
  private projectService: ProjectService;
  private loadingService: LoadingService;
  private toastService: ToastService;
  private modalService: ModalService;
  private userService: UserService;
  private routerService: RouterService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.toastService = ToastService.instance;
    this.modalService = ModalService.instance;
    this.userService = UserService.instance;
    this.routerService = RouterService.instance;
  }

  public componentDidMount() {
   this.loadDirection();
  }

  public render() {
    const ideasToShow = this.state.direction ? this.state.direction.DirectionIdea.filter(idea => idea.Status === 1) : [];
    return (
      this.state.direction && (
        <Page title={`Направление: "${this.state.direction!.DirectionTitle}"`}>
          <AcLoader>
            <div className="direction-page">
              <div className="description">
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {this.state.direction!.DirectionDescription}
                </pre>
              </div>
              {this.state.currentUser
              ? (
                Date.now() > this.state.direction!.Project.ProposeStartDate
                ? Date.now() < this.state.direction!.Project.ProposeEndDate
                  ? this.state.isUserParticipate 
                    ? (
                      <div className="button-container">
                        {this.state.currentUser!.Role === Roles.User && (
                          <AcButton 
                            title="Предложить идею"
                            type="secondary"
                            onClick={this.openProposeForm}
                          />
                        )}
                        {this.state.currentUser!.Role === Roles.Expert && (
                          <AcButton 
                            title="Рассмотрение идей"
                            type="secondary"
                            onClick={this.openReviewIdeaPage}
                          />
                        )}
                      </div>)
                    : (<AcAlert>
                      Подвердите участие на странице проекта
                    </AcAlert>)
                  : (<AcAlert>
                      <div>
                        Фаза подачи идей завершена
                      </div>
                      <div>
                        Вы можете ознакомиться с идеями и поддержать понравившуюся
                      </div>
                    </AcAlert>)
                :  (<AcAlert>
                    Дождитесь начала проекта
                  </AcAlert>)
              )
              : (<AcAlert>
                  Войдите в систему
                </AcAlert>)}
              <div className="divider"></div>
              {ideasToShow.length ? (
                <div className="ideas">
                  {ideasToShow.map((item, index) => (
                    <div onClick={() => this.openIdea(item)} key={index}>
                      <IdeaCard idea={item} />
                    </div>
                  ))}
                </div>
              ): <AcEmptyState text="Ещё никто не предложил идеи. Будьте первым!" /> }
            </div>
          </AcLoader>
          <AcModal title="Подача идеи">
            <ProposeIdeaModal
              onConfirm={(idea: any) => this.onModalConfirm(idea)}
            />
          </AcModal>
        </Page>
      ) || <div></div>
    )
  }

  @Autobind
  private loadDirection() {
    this.loadingService.changeLoader(true);
    this.projectService.getDirectionById(this.props.match.params.directionId).then((data: any) => {
      this.setState({ direction: data });
      this.loadingService.changeLoader(false);
      this.userService.$currentUser.subscribe((user: any) => { 
        this.setState({ currentUser: user }, () => {
         this.state.direction && this.state.currentUser &&  this.projectService.isUserParticipate(this.state.direction!.Project.Id, this.state.currentUser!.Id).then((response: any) => {
           this.setState({ isUserParticipate: response });
         });
        });
       });
    });
  }

  @Autobind
  private openProposeForm() {
    this.modalService.changeModalVisibility(true);
  }

  @Autobind
  private onModalConfirm(idea: any) {
    const model: AddIdeaModel = {
      DirectionId: this.props.match.params.directionId,
      IdeaDescription: idea.description,
      IdeaTitle: idea.title,
      UserId: this.state.currentUser!.Id,
      CreateDate: +new Date(),
    }
    
    this.projectService.addIdea(model).then(() => {
      this.toastService.changeEvent({ message: "Идея успешно загружена", type: EventType.Success, show: true });
      this.modalService.changeModalVisibility(false);
      this.loadDirection();
    })
  }

  @Autobind
  private openIdea(idea: DirectionIdea) {
    this.routerService.redirect(`/idea/${idea.Id}`);
  }

  @Autobind
  private openReviewIdeaPage() {
    this.routerService.redirect(`/all-ideas/${this.props.match.params.directionId}`);
  }
}