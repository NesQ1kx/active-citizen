import React, { Component } from "react";

import "./AcLoader.component.scss";
import { LoadingService } from "../../../services";

interface Props {}

interface State {
  loading: boolean
}

export class AcLoader extends Component<Props, State> {
  public state: State = {
    loading: true
  }
  private loadingService: LoadingService;

  constructor(props: Props) {
    super(props);
    this.loadingService = LoadingService.instance;
  }

  public componentDidMount() {
    this.loadingService.$loaderChange.subscribe(value => this.setState({ loading: value }));
  }
  public render() {
    return (
      <div className="ac-loader">
          <div className={`bluring-content ${this.state.loading ? '-loading' : ''}`}>
              {this.props.children}
          </div>
          {this.state.loading && (
            <div className="spinner">
              <i className="fas fa-spinner fa-2x"></i>
            </div>
          )}
      </div>
    )
  }
}