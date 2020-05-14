import React, { Component, useState } from "react";
import DatePicker from "react-datepicker";
import { Autobind } from "../../../helpers";
import { FormInput } from "../../../types";

import "react-datepicker/dist/react-datepicker.css";
import "./AcDatePicker.component.scss";


interface Props {
  label: string;
  formInput?: FormInput;
  onChange?: (value: any) => void;
  minDate?: Date;
  maxDate?: Date;
  isRequired?: boolean;
}

interface State {
  selectedDate: any;
}

const CustomInput = ({ value, onClick }: any) => {
  return (
    <div className="custom-input" onClick={onClick}>
      { value }
      <i className="far fa-calendar-alt"></i>
    </div>
  )  
}

export class AcDatePciker extends Component<Props, State> {
  public state: State = {
    selectedDate: this.props.formInput!.value || new Date(),
  }
  public render() {
    return (
      <div className="ac-date-picker">
        <div className="label">
          { this.props.label }{ this.props.isRequired ? "*" : "" }
        </div>
        <DatePicker
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        dateFormat="dd.MM.yyyy HH:mm"
        selected={new Date(+this.props.formInput!.value || Date.now())}
        onChange={this.onDateChange}
        customInput={<CustomInput />}
        showMonthDropdown
        showYearDropdown
        showTimeSelect
        timeCaption="time"
        timeFormat="HH:mm"
        dropdownMode="select"
      />
      </div>
    )
  }

  @Autobind
  private onDateChange(value: Date) {
    this.setState({ selectedDate: value }, () => this.props.onChange && this.props.onChange(value));
  }
}