import React, { Component } from "react";
import { LabelWithHover } from "../../LabelWithHover";

import "./AcDropDown.component.scss";
import { Autobind } from "../../../helpers";

interface Props {
  label?: string;
  isRequired?: boolean;
  withHint?: boolean;
  hintText?: string;
  onChange?: (value: any) => void;
  list: any[];
}

interface State {
  isValid: boolean;
  isListOpen: boolean;
  selectedItem: any;
}

export class AcDropDown extends Component<Props, State> {
  public state: State = {
    isValid: true,
    isListOpen: false,
    selectedItem: this.props.list[0]
  }

  public render() {
    return(
      <div className="ac-drop-down">
        <div style={{display: "flex"}}>
          <label className={!this.state.isValid ? "error" : ""}>{this.props.label}{this.props.isRequired ? "*" : ""}</label>
          {this.props.withHint && (
            <LabelWithHover text={this.props.hintText!}>
              <i className="fas fa-info-circle"></i>
            </LabelWithHover>
          )}
        </div>
        <div className={`drop-down-input ${this.state.isListOpen ? '-open' : ''}`} onClick={this.toggleList}>
            {this.state.selectedItem.value}
            <div className="chevron">
              {this.state.isListOpen 
                ? <i className="fas fa-chevron-up"></i>
                : <i className="fas fa-chevron-down"></i>
              }
            </div>
            {this.state.isListOpen && (
              <ul className="drop-down-list">
                {this.props.list.map((item) => (
                  <li key={item.key} onClick={() => this.selectItem(item)}>{item.value}</li>
                ))}
            </ul>
            )}
        </div>
        <div className="error-msg">
          {!this.state.isValid && (<span>Это поле необходимо заполнить</span>)}
        </div>
      </div>
    )
  }

  @Autobind
  private toggleList() {
    this.setState({
      isListOpen: !this.state.isListOpen
    })
  }

  @Autobind
  private selectItem(item: any) {
    this.setState({
      selectedItem: item
    }, () => this.props.onChange && this.props.onChange(item.key));
  }
}