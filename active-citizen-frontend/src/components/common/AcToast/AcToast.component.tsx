import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import { ToastService } from "../../../services/Toast.service";
import { ToastEvent, EventType } from "../../../types";

import "./AcToast.component.scss";
import { Autobind } from "../../../helpers";
interface Props {}

interface State {
  event: ToastEvent;
}

export class AcToast extends Component<Props, State> {
  public state: State = {
    event: {
      show: false,
    }
  };
  private toastService: ToastService;

  constructor(props: Props) {
    super(props);
    this.toastService = ToastService.instance;
  }

  public componentDidMount() {
    this.toastService.toastEventChange.subscribe((event: ToastEvent) => {
      this.setState({ event: event });
      this.startDelay();
    });
  }

  public render() {
    const eventType = this.state.event.type;
    return (
        <ReactCSSTransitionGroup
          transitionName="toast"
          transitionEnter={true}
          transitionAppear={false}
          transitionEnterTimeout={400}
          transitionLeave={true}
          transitionLeaveTimeout={400}
        >
          {this.state.event.show && (
            <div className={`ac-toast ${eventType === EventType.Error ? 'error' : 'success'}`} >
              {eventType === EventType.Error 
                ? <i className="far fa-times-circle fa-2x"></i>
                : <i className="far fa-check-circle fa-2x"></i>
              }
              <div className="toast-message">{this.state.event.message}</div>
            </div>
          )}
        </ReactCSSTransitionGroup>
    )
  }

  @Autobind
  private startDelay() {
    setTimeout(() => {
      this.setState({ event: { show: false } });
    }, 2000);
  }
}