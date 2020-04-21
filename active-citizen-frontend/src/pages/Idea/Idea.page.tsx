import React, { Component } from "react";
import { Page } from "../../components";
import { ProjectService, UserService, LoadingService } from "../../services";
import { DirectionIdea, User } from "../../models";

interface Props {
  match: any;
}

interface State {
  idea?: DirectionIdea;
  currentUser?: User;
}

export class Idea extends Component<Props, State> {
  public state: State = {
    idea: undefined,
    currentUser: undefined,
  }
  private projectService: ProjectService;
  private userService: UserService;
  private loadingService: LoadingService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
    this.userService = UserService.instance;
    this.loadingService = LoadingService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.projectService.getIdea(this.props.match.params.ideaId).then((idea: any) => {
      this.setState({ idea });
      this.loadingService.changeLoader(false);
      this.userService.$currentUser.subscribe((user: any) => {
        this.setState({ currentUser: user });
      })
    })
  }

  public render() {
    return (
      <Page title="">

      </Page>
    )
  }
}