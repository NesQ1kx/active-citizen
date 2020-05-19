import React, { Component } from "react";
import { AcButton, AcFileInput } from "../common";
import { FormInput } from "../../types";
import { Autobind } from "../../helpers";

import "./EditAvatarModal.component.scss";


interface Props {
  onUpdate: (avatar: string) => void;
  onDelete: () => void;
}

interface State {
  newAvatar: FormInput;
}

export class EditAvatarModal extends Component<Props, State> {
  public state: State = {
    newAvatar: {
      value: '',
      validationFunctions: [],
      valid: true,
    }
  }

  public render() {
    return (
      <div className="edit-avatar-modal">
        <div className="button-container">
          <div style={{marginTop: "5px"}}>
            <AcButton
              type="secondary"
              title="Удалить"
              onClick={this.props.onDelete}
            />
          </div>
          <AcFileInput
            formInput={this.state.newAvatar}
            onChange={(value) => this.onInputChange(value)}
          />
        </div>
          <div className="modal-footer">
            <AcButton
              title="Сохранить"
              type="primary"
              onClick={this.onSave}
            />
          </div>
      </div>
    );
  }

  @Autobind
  private onInputChange(value: string) {
    this.setState({ newAvatar: { ...this.state.newAvatar, value }});
  }

  @Autobind
  private onSave() {
    this.props.onUpdate(this.state.newAvatar.value);
  }
}