import React, { Component } from 'react';
import { Header, AcToast, SubHeader } from './components';
import { BrowserRouter as Router, Route, RouteComponentProps, BrowserRouter } from 'react-router-dom';
import { LoginPage, NewsPage, SignupPage } from './pages';
import { UserService } from './services';

import './App.scss';
import { LoadProject } from './pages/LoadProject';

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
          <Route exact path="/" component={NewsPage} />
          <Route exact path="/signin" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route excat path="/load-project" component={LoadProject} />
        </Router>
        <AcToast />
      </div>
    );
  }
}

export default App;
