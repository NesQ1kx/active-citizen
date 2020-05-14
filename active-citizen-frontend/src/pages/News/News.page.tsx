import React, { Component } from "react";
import { Page } from "../../components";

interface Props {
  match: any;
}

export class NewsPage extends Component<Props> {
  public render() {
    return (
      <Page title="Новость">
        {this.props.match.params.newsId}
      </Page>
    );
  }
}