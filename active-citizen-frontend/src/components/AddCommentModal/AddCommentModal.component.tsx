import React, { Component } from "react";
import { FormInput } from "../../types";
import { IdeaComment } from "../../models/IdeaComment";
import { requireValidationFunction } from "../../constants";
import { AcTextArea, AcButton } from "../common";

import "./AddCommentModal.component.scss"
import { Autobind } from "../../helpers";

interface FormFields {
  commentText: FormInput;
}

interface Props {
  onAddComment: (commentText: string) => void;
}

interface State {
  formState: FormFields;
  isFormValid: boolean;
}

export class AddCommentModal extends Component<Props, State> {
  public state: State = {
    isFormValid: false,
    formState: {
      commentText: {
        valid: false,
        value: '',
        validationFunctions: [requireValidationFunction],
      }
    }
  }

  public render() {
    return (
      <div className="add-comment-modal">
        <AcTextArea
          formInput={this.state.formState.commentText}
          label="Текст комментария"
          onChange={(value, isValid) => this.inputChange("commentText", value, isValid)}
          isRequired={true}
        />
        <div className="modal-footer">
          <AcButton
            title="Добавить"
            disabled={!this.state.isFormValid}
            type="primary"
            onClick={this.handleConfirm}
          />
        </div>
      </div>
    );
  }

  @Autobind
  private inputChange(formFiled: keyof FormFields, value: any, isValid: boolean) {
    let isFormValid;
    this.setState({
      formState: {
        ...this.state.formState,
        [formFiled]: { ...this.state.formState[formFiled], value, valid: isValid},
      },
    }, () => isFormValid = this.validateForm());
  }

  @Autobind
  private validateForm() {
    let valid = Object.keys(this.state.formState).every((field: any) => {
      let input = field as keyof FormFields;
      return this.state.formState[input].valid;
    });
    this.setState({
      isFormValid: valid,
    });
  }

  @Autobind
  private handleConfirm() {
    this.props.onAddComment(this.state.formState.commentText.value);
  }
}