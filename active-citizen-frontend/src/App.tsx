import React, { Component } from 'react';
import { Header, AcToast, SubHeader, AcModal } from './components';
import { BrowserRouter as Router, Route, RouteComponentProps, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { LoginPage, NewsPage, SignupPage, CurrentProjects, LoadProject, ProjectPage, EditProject, Direction, ProfilePage, AllIdeasPage, Idea, EmailConfirmation, EmailComfirmed, FinishedProjects } from './pages';
import { UserService, ModalService } from './services';

import './App.scss';
import { RouterService } from './services/Router.service';
import { ModalContent } from './types';

interface Props {}

interface State {
  redirectTo?: string;
  modalContent?: ModalContent;
}

class App extends Component<Props, State> {
  public state: State = {
    redirectTo: undefined,
    modalContent: undefined,
  }
  private userService: UserService;
  private routerService: RouterService;
  private modalService: ModalService;

  constructor(props: any) {
    super(props);
    this.userService = UserService.instance;
    this.routerService = RouterService.instance;
    this.modalService = ModalService.instance;
  }

  public componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("AccessToken")!);
    if (userInfo) {
      this.userService.getUserData(userInfo.email);
    }
    this.routerService.$routeChange.subscribe(route => {
      this.setState({ redirectTo: route });
    });
    this.modalService.$modalVisibilityChange.subscribe(value => this.setState({ modalContent: value }));
  }

  public render() {
    return (
      <div className="App" id="app">
        <Router>
          <Header />
          <div className="main">
            <Switch>
              <Route exact path="/" component={NewsPage} />
              <Route path="/signin" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
              <Route path="/load-project" component={LoadProject} />
              <Route path="/current-projects/:projectId" component={ProjectPage} />
              <Route path="/current-projects" component={CurrentProjects} />
              <Route path="/edit-project/:projectId" component={EditProject} />
              <Route path="/direction/:directionId" component={Direction} />
              <Route path="/profile/:userId" component={ProfilePage} />
              <Route path="/all-ideas/:directionId" component={AllIdeasPage} />
              <Route path="/idea/:ideaId" component={Idea} />
              <Route path="/confirm" component={EmailConfirmation} />
              <Route path="/confirmed/:token" component={EmailComfirmed} />
              <Route path="/finished-projects" component={FinishedProjects} />
            </Switch>
          </div>
        {this.state.redirectTo && <Redirect to={this.state.redirectTo} />}
        </Router>
        <AcToast />
        <AcModal />
      </div>
    );
  }
}

export default App;
