import React, { Component } from 'react';
import { Header, AcToast, AcModal } from './components';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { LoginPage,
         MainPage,
         SignupPage,
         CurrentProjects,
         LoadProject,
         ProjectPage,
         EditProject,
         Direction,
         ProfilePage,
         AllIdeasPage,
         Idea,
         EmailConfirmation,
         EmailComfirmed,
         FinishedProjects,
         FinishedProject, 
         AddNews,
         NewsPage,
         EditNews,
         SearchUsers,
         HowItWorks} from './pages';
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
      this.setState({ redirectTo: route }, () => route && this.routerService.redirect(undefined));
    });
    this.modalService.$modalVisibilityChange.subscribe(value => this.setState({ modalContent: value }));
  }

  public render() {
    return (
      <div className="App" id="app">
        <Router>
          {this.state.redirectTo && (<Redirect to={this.state.redirectTo} push exact />)}
          <Header />
          <div className="main">
            <Switch>
              <Route exact path="/" component={MainPage} />
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
              <Route path="/finished-projects/:projectId" component={FinishedProject} />
              <Route path="/finished-projects" component={FinishedProjects} />
              <Route path="/add-news" component={AddNews} />
              <Route path="/news/:newsId" component={NewsPage}/>
              <Route path="/edit-news/:newsId" component={EditNews}/>
              <Route path="/search-users" component={SearchUsers} />
              <Route path="/how-it-works" component={HowItWorks} />
            </Switch>
          </div>
        </Router>
        <AcToast />
        <AcModal />
      </div>
    );
  }
}

export default App;
