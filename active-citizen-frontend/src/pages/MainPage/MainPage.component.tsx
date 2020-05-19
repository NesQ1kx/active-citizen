import React, { Component } from "react";

import "./MainPage.component.scss";
import { Page, ProjectsSlider, AcLoader, AcButton, NewsCard, AcEmptyState } from "../../components";
import { UserService, CommonService } from "../../services";
import { User, Roles } from "../../models";
import { Link } from "react-router-dom";
import { News } from "../../models/News";

interface Props {}

interface State {
  currentUser?: User;
  news: News[];
}

export class MainPage extends Component<Props> {
  public state: State = {
    currentUser: undefined,
    news: [],
  }
  private userService: UserService;
  private commonService: CommonService;


  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
    this.commonService = CommonService.instance;
  }

  public componentDidMount() {
    this.userService.$currentUser.subscribe((user: any) => {
      user && this.setState({ currentUser: user });
    });

    this.commonService.getAllNews().then((news: any) => {
      this.setState({ news });
    });
  }

  public render() {
    return (
      <div className="main-page">
        <div className="slider-container">
          <ProjectsSlider />
          <div className="line"></div>
        </div>
        <div className="main">
          <Page title="Последние новости" width="1192">
            <AcLoader>
                {this.state.news.length
                ? (
                  <div className="all-news-page" >
                    {this.state.news.map((news, index) => (
                      <NewsCard news={news} key={index} />
                    ))}
                  </div>
                )
                : (<AcEmptyState text="Нет новостей" />)
                }
            </AcLoader>
          </Page>
        </div>
      </div>
    )
  }
}