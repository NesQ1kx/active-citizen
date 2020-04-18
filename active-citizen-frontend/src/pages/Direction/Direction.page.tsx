import React, { Component } from "react";
import { Page, AcLoader, AcButton, AcModal, ProposeIdeaModal, AcEmptyState, IdeaCard } from "../../components";
import { ProjectService, LoadingService, ToastService, ModalService, UserService } from "../../services";
import { ProjectDirection, User } from "../../models";

import "./Direction.page.scss"
import { Autobind } from "../../helpers";
import { AddIdeaModel, EventType } from "../../types";
import { Redirect } from "react-router";

interface Props {
  match: any;
}

interface State {
  direction?: ProjectDirection;
  currentUser?: User;
  redirect: boolean;
}

export class Direction extends Component<Props, State> {
  public state: State = {
    direction: undefined,
    redirect: false,
  }
  private projectService: ProjectService;
  private loadingService: LoadingService;
  private toastService: ToastService;
  private modalService: ModalService;
  private userService: UserService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.toastService = ToastService.instance;
    this.modalService = ModalService.instance;
    this.userService = UserService.instance;
  }

  public componentDidMount() {
   this.loadDirection();
   this.userService.$currentUser.subscribe((user: any) => this.setState({ currentUser: user }));
  }

  public render() {
    const ideasToShow = this.state.direction ? this.state.direction.DirectionIdea.filter(idea => idea.Status === 1) : [];
    return (
      this.state.direction && (
        <Page title={this.state.direction!.DirectionTitle}>
          <AcLoader>
            <div className="direction-page">
              <div className="description">
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {this.state.direction!.DirectionDescription}
                </pre>
              </div>
              <div className="button-container">
                <AcButton 
                  title="Предложить идею"
                  type="secondary"
                  onClick={this.openProposeForm}
                />
                <AcButton 
                  title="Рассмотрение идей"
                  type="secondary"
                  onClick={() => this.setState({ redirect: true })}
                />
              </div>
              <div className="divider"></div>
              {ideasToShow.length ? (
                <div className="ideas">
                  {ideasToShow.map((item, index) => (
                    <div onClick={() => {}} key={index}>
                      <IdeaCard idea={item} />
                    </div>
                  ))}
                </div>
              ): <AcEmptyState text="Ещё никто не предложил идеи. Будьте первым!" /> }
            </div>
            {this.state.redirect && <Redirect to={`/all-ideas/${this.props.match.params.directionId}`} /> }
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
}