import React, { Component } from "react";
import { Page, AcButton } from "../../components";
import { News } from "../../models/News";
import { CommonService, UserService, ToastService, RouterService } from "../../services";
import { User, Roles } from "../../models";

import "./News.page.scss";
import { DateFormatter, Autobind } from "../../helpers";
import { EventType } from "../../types";

interface Props {
  match: any;
}

interface State {
  news?: News;
  currentUser?: User;
}

export class NewsPage extends Component<Props, State> {
  public state: State = {
    news: undefined,
  }

  private commonService: CommonService;
  private userService: UserService;
  private toastService: ToastService;
  private routerService: RouterService;

  constructor(props: Props) {
    super(props);
    this.commonService = CommonService.instance;
    this.userService = UserService.instance;
    this.toastService = ToastService.instance;
    this.routerService = RouterService.instance;
  }

  public componentDidMount() {
    this.commonService.getNewsById(this.props.match.params.newsId).then((news: any) => {
      this.setState({ news });
    });

    this.userService.$currentUser.subscribe((user: any) => {
      user && this.setState({ currentUser: user });
    });
  }

  public render() {
    return (
      this.state.news && (
        <Page title={this.state.news.Title}>
          {this.state.currentUser && this.state.currentUser.Role === Roles.Admin && (
            <div className="page-actions">
              <div className="button-container">
                <AcButton
                  title="Редактировать"
                  type="primary"
                  onClick={() => this.routerService.redirect(`/edit-news/${this.props.match.params.newsId}`)}
                /> <AcButton
                  title="Удалить"
                  type="negative"
                  onClick={this.deleteNews}
                />
              </div>
            </div>
          )}
          <div className="news-page">
            <div className="image">
              <img src={this.state.news.Image} alt="" />
            </div>
            <div className="text">
              <pre style={{whiteSpace: "pre-wrap"}}>
                  {this.state.news.Text}
                </pre>
            </div>
            <div className="divider"></div>
            <span className="create-date">{DateFormatter(this.state.news.CreateDate, true)}</span>
          </div>
        </Page>
      ) || <div></div>
    );
  }

  @Autobind
  private deleteNews() {
    this.commonService.deleteNews(this.state.news!.Id).then(() => {
      this.toastService.changeEvent({ message: "Новость удалена", type: EventType.Success, show: true });
      this.routerService.redirect("/");
    }, () => this.toastService.changeEvent({ message: "Не удалось удалить новость", type: EventType.Error, show: true }));
  }
}