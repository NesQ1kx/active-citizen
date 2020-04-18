import React, { Component } from "react";
import { Page, AcLoader, IdeaCard, AcModal, ReviewIdeaModal, AcEmptyState } from "../../components";
import { DirectionIdea } from "../../models";
import { ProjectService, LoadingService, ModalService } from "../../services";

import "./AllIdeas.page.scss"
import { Autobind } from "../../helpers";

interface Props {
  match: any;
}

interface State {
  ideas: DirectionIdea[];
  selectedIdea?: DirectionIdea;
}

export class AllIdeasPage extends Component<Props, State> {
  public state: State = {
    ideas: []
  }
  private projectService: ProjectService;
  private loadingService: LoadingService;
  private modalService: ModalService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.loadingService = LoadingService.instance;
    this.modalService = ModalService.instance;
  }

  public componentDidMount() {
    this.loadIdeas();
  }
  public render() {
    const ideasToShow = this.state.ideas.filter(idea => idea.Status === 0);
    return (
      <Page title="Рассмотрение идей">
        <AcLoader>
          {ideasToShow.length ? (
            <div className="all-ideas">
            {ideasToShow.map((item, index) => (
              <div onClick={() => this.openModal(item)} key={index}>
                <IdeaCard idea={item} />
              </div>
            ))}
          </div>
          ): <AcEmptyState text="Идеи для рассмотрения пока что отсутствуют"/>}
        </AcLoader>
        <AcModal title="Рассмотрение идеи">
          <ReviewIdeaModal idea={this.state.selectedIdea!} onConfirm={this.onModlaConfirm} />
        </AcModal>
      </Page>
    )
  }

  @Autobind
  private openModal(idea: DirectionIdea) {
    this.setState({ selectedIdea: idea}, () => this.modalService.changeModalVisibility(true));
  }

  @Autobind
  private onModlaConfirm() {
    this.loadIdeas();
    this.modalService.changeModalVisibility(false);
  }

  private loadIdeas() {
    this.loadingService.changeLoader(true);
    this.projectService.getIdeas(this.props.match.params.directionId).then((ideas: any) => {
      this.setState({ ideas });
      this.loadingService.changeLoader(false);
    }, () => this.loadingService.changeLoader(false));
  }
}