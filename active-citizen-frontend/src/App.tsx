import React, { Component } from 'react';
import './App.scss';
import { Header } from './components';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import { LoginPage, NewsPage, SignupPage } from './pages';

class App extends Component {
  public render() {
    return (
      <div className="App" id="app">
        <Router>
          <Header />
          <Route exact path="/" component={NewsPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
        </Router>
      </div>
    );
  }
}

export default App;
