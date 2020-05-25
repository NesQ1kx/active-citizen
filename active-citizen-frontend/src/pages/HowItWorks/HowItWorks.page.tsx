import React, { Component } from "react";
import { Page } from "../../components";

import "./HowItWorks.page.scss"

export class HowItWorks extends Component {
  public render() {
    return (
      <Page title="Как это работает">
        <div className="how-it-works">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={require("../../assets/images/idea.jpg")} alt=""/>
                </div>
                <div className="flip-card-back">
                  Предлагайте идеи для улучшения городской жизни
                </div>
              </div>
              <h3>Предлагайте идеи</h3>
            </div>
            <i className="fas fa-chevron-down fa-3x"></i>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={require("../../assets/images/expert.jpg")} alt=""/>
                </div>
                <div className="flip-card-back">
                  Команда опытных экспертов отберёт наиболее эффективные из предложенных идей
                </div>
              </div>
              <h3>Экспертный отбор</h3>
            </div>
            <i className="fas fa-chevron-down fa-3x"></i>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={require("../../assets/images/dialog.jpg")} alt=""/>
                </div>
                <div className="flip-card-back">
                  Принимайте участие в обсуждении отобранных идей
                </div>
              </div>
              <h3>Обсуждайте</h3>
            </div>
            <i className="fas fa-chevron-down fa-3x"></i>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={require("../../assets/images/vote.jpg")} alt=""/>
                </div>
                <div className="flip-card-back">
                  Голосуйте за понравившиеся вам идеи
                </div>
              </div>
              <h3>Голосуйте</h3>
            </div>
            <i className="fas fa-chevron-down fa-3x"></i>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={require("../../assets/images/realise.jpg")} alt=""/>
                </div>
                <div className="flip-card-back">
                  ТОП-10 лучших идей по итогам голосования будут реализованы городом
                </div>
              </div>
              <h3>Реализация</h3>
            </div>
        </div>
      </Page>
    );
  }
}