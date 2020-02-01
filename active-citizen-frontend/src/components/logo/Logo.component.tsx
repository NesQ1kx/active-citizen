import React, { Component } from "react";

import "./Logo.component.scss";
import { NavLink } from "react-router-dom";

export class Logo extends Component {
  public render() {
    return (
      <NavLink to="/" className="logo">
      </NavLink>
    )
  }
}