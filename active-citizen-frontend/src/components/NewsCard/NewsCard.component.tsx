import React, { Component } from "react";
import { News } from "../../models/News";

import "./NewsCard.component.scss";
import { Link } from "react-router-dom";

interface Props {
  news: News;
}

export class NewsCard extends Component<Props> {
  public render() {
    return (
      <Link to={`/news/${this.props.news.Id}`}>
        <div className="news-card">
          <div className="card-image">
            <img src={this.props.news.Image} alt=""/>
          </div>
          <div className="card-content">
            <h3 className="title">{this.props.news.Title}</h3>
            <div className="description">{this.props.news.Text}</div>
          </div>
        </div>
      </Link>
    );
  }
}