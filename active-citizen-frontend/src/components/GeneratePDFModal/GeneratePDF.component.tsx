import React, { Component } from "react";
import { Project } from "../../models";

import "./GeneratePDF.component.scss";
import { AcButton } from "../common";
import { Autobind } from "../../helpers";

interface Props {
  project: Project
  onConfirm: () => void;
}

export class GeneratePDFModal extends Component<Props> {
  public render() {
    return (
      <div className="generate-pdf-modal" id="to-pdf">
        <h1 className="title">{this.props.project.ProjectTitle}</h1>
        {this.props.project.ProjectDirection.map((direction, index) => (
          <div className="direction" key={index}>
            <h3>{index + 1}. Направление: "{direction.DirectionTitle}"</h3>
          </div>
        ))}
        <div className="modal-footer">
          <AcButton
            title="Сгенерировать"
            type="primary"
            onClick={this.onConfirm}
          />
        </div>
      </div>
    );
  }

  @Autobind
  private onConfirm() {
    this.props.onConfirm();
  }
}