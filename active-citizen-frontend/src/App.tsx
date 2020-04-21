import React, { Component } from 'react';
import { Header, AcToast, SubHeader } from './components';
import { BrowserRouter as Router, Route, RouteComponentProps, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { LoginPage, NewsPage, SignupPage, CurrentProjects, LoadProject, ProjectPage, EditProject, Direction, ProfilePage, AllIdeasPage, Idea } from './pages';
import { UserService } from './services';

import './App.scss';
import { RouterService } from './services/Router.service';

interface Props {}

interface State {
  redirectTo?: string;
}

class App extends Component<Props, State> {
  public state: State = {
    redirectTo: undefined,
  }
  private userService: UserService;
  private routerService: RouterService;

  constructor(props: any) {
    super(props);
    this.userService = UserService.instance;
    this.routerService = RouterService.instance;
  }

  public componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("AccessToken")!);
    if (userInfo) {
      this.userService.getUserData(userInfo.email);
    }
    this.routerService.$routeChange.subscribe(route => {
      this.setState({ redirectTo: route });
    });
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
            </Switch>
          </div>
        {this.state.redirectTo && <Redirect to={this.state.redirectTo} />}
        </Router>
        <AcToast />
      </div>
    );
  }
}

export default App;
