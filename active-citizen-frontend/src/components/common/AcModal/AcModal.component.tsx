import React, { Component } from "react";

import "./AcModal.component.scss";
import { ModalService } from "../../../services/Modal.service";
import { Autobind } from "../../../helpers";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { ModalContent } from "../../../types";

interface Props {
  title?: string;
}

interface State {
  content?: ModalContent
}

export class AcModal extends Component<Props, State> {
  private modalService: ModalService;
  public state: State = {
    content: undefined,
  }
  constructor(props: Props) {
    super(props);
    this.modalService = ModalService.instance;
  }

  public componentDidMount() {
    this.modalService.$modalVisibilityChange.subscribe(value => this.setState({ content: value }));
  }

  public render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="modal"
        transitionEnter={true}
        transitionAppear={false}
        transitionEnterTimeout={200}
        transitionLeave={true}
        transitionLeaveTimeout={200}
      >
        {this.state.content && (
        <div className="ac-modal">
          <div className="wrapper" onClick={this.closeModal}></div>
          <div className="content">
            <div className="head">
              <h3>{this.state.content.title}</h3>
              <i className="fas fa-times" onClick={this.closeModal}></i>
            </div>
            {this.state.content.body}
          </div>
        </div>
      )}
      </ReactCSSTransitionGroup>
     
    )
  }

  @Autobind
  private closeModal() {
    this.modalService.changeModalVisibility(false);
  }
}