import React, { Component } from 'react';
import { Header, AcToast, SubHeader } from './components';
import { BrowserRouter as Router, Route, RouteComponentProps, BrowserRouter, Switch } from 'react-router-dom';
import { LoginPage, NewsPage, SignupPage, CurrentProjects, LoadProject, ProjectPage, EditProject, Direction, ProfilePage, AllIdeasPage } from './pages';
import { UserService } from './services';

import './App.scss';

interface Props {}

class App extends Component<Props> {
  private userService: UserService;

  constructor(props: any) {
    super(props);
    this.userService = UserService.instance;
  }

  public componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("AccessToken")!);
    if (userInfo) {
      this.userService.getUserData(userInfo.email);
    }
  }

  public render() {
    return (
      <div className="App" id="app">
        <Router>
          <Header />
          {/* <SubHeader /> */}
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
            </Switch>
          </div>
        </Router>
        <AcToast />
      </div>
    );
  }
}

export default App;
