import React, { Component } from 'react';
import { Header, AcToast, SubHeader } from './components';
import { BrowserRouter as Router, Route, RouteComponentProps, BrowserRouter, Switch } from 'react-router-dom';
import { LoginPage, NewsPage, SignupPage, CurrentProjects, LoadProject, ProjectPage, EditProject } from './pages';
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
          <SubHeader />
          <div className="main">
            <Switch>
              <Route exact path="/" component={NewsPage} />
              <Route exact path="/signin" component={LoginPage} />
              <Route exact path="/signup" component={SignupPage} />
              <Route excat path="/load-project" component={LoadProject} />
              <Route exact path="/current-projects/:id" component={ProjectPage} />
              <Route exact path="/current-projects" component={CurrentProjects} />
              <Route exact path="/edit-project/:id" component={EditProject} />
            </Switch>
          </div>
        </Router>
        <AcToast />
      </div>
    );
  }
}

export default App;
