import React, { Component } from "react";
import { Project, User, DirectionIdea } from "../../models";
import {Doughnut, Bar, Pie} from 'react-chartjs-2';

import "./ProjectStatistic.component.scss";
import { ProjectService } from "../../services";
import { GetCommentarySpelling, Autobind, GetYearSpelling, GetIdeaSpelling, GetDefaultAvatar, GetDateDistance } from "../../helpers";
import { IdeaComment } from "../../models/IdeaComment";
import { UserAvatar } from "../UserAvatar";
import { NavLink } from "react-router-dom";

interface Props {
  project: Project;
}

interface State {
  participants: User[];
}


export class ProjectStatistic extends Component<Props, State> {
  public state: State = {
    participants: [],
  }
  
  private projectService: ProjectService;

  constructor(props: Props) {
    super(props);
    this.projectService = ProjectService.instance;
  }

  public componentDidMount() {
    this.projectService.getProjectParticipants(this.props.project.Id).then((data: any) => {
      this.setState({ participants: data });
    })
  }

  public render() {
    return (
      <div className="project-statistic">
        <div id="to-pdf1">
          {this.renderProjectScores()}
          {this.renderDistrictsStatistic()}
        </div>
        <div id="to-pdf2">
          {this.renderIdeasStatistic()}
          {this.renderPartisipantsStatistic()}
        </div>
        <div id="to-pdf3">
          {this.renderActiveParticipants()}
        </div>
      </div>
    );
  }

  public renderProjectScores() {
    const participantsCount = this.props.project.ParticipantsCount;
    const ideasCount = this.props.project.IdeasCount;
    let ideasToRealise: DirectionIdea[] = [];
    let commentsCount = 0;
    this.props.project.ProjectDirection.forEach(d => {
      ideasToRealise = [...ideasToRealise, ...d.DirectionIdea.filter(idea => idea.Status === 1).sort((a, b) => a.VotesCount - b.VotesCount).slice(0, 10)];
      commentsCount += d.DirectionIdea.map(item => item.CountOfComments).reduce((sum, value) => sum + value, 0)
    });
    return (
      <div className="project-scores">
        <div className="row">
          <div className="item">
            <div className="value">{participantsCount}</div>
            <div className="text">общее количество участников</div>
          </div>
        </div>
        <div className="row">
          <div className="item">
            <div className="value">{ideasCount}</div>
            <div className="text">{GetIdeaSpelling(ideasCount)}, предложенные участниками</div>
          </div>
          <div className="item">
            <div className="value">{ideasToRealise.length}</div>
            <div className="text">{GetIdeaSpelling(ideasCount)} будет реализовано городом</div>
          </div>
        </div>
        <div className="row">
        <div className="item">
            <div className="value">{commentsCount}</div>
            <div className="text">{GetCommentarySpelling(commentsCount)} оставили участники</div>
          </div>
        </div>  
      </div>
    );
  }

  @Autobind
  private renderDistrictsStatistic() {
    const map = new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0]
    ]);
    
    this.state.participants.forEach(p => {
      const districtId = p.DistrictNavigation.Id;
      map.set(districtId, map.get(districtId)! + 1);
    });

    const data = {
      labels: [
        'Фрунзенский',
        'Октябрьский',
        'Заводской',
        'Волжский',
        'Ленинский',
        'Кировский',
      ],
      datasets: [{
        data: Array.from(map.values()),
        backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#32a852',
        '#6dbdbd',
        '#b491db',
        '#a9ff38',
        ],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#32a852',
        '#6dbdbd',
        '#b491db',
        '#a9ff38',
        ]
      }]
    };
    return (
      <div className="statistic-section districts-statistic">
        <h4>Распределение участников по районам города</h4>
        <Doughnut data={data}/>
      </div>
    );
  }

  @Autobind
  private renderIdeasStatistic() {
    const countOfIdeasPerDirection: number[] = [];
    this.props.project.ProjectDirection.forEach(d => countOfIdeasPerDirection.push(d.DirectionIdea.length));
    const labels = this.props.project.ProjectDirection.map(d => d.DirectionTitle);
    const data = {
      labels,
      datasets: [
        {
          label: 'Количество идей',
          backgroundColor: `rgba(43, 255, 68, 0.6)`,
          hoverBackgroundColor: `rgba(43, 255, 68, 1 )`,
          data: countOfIdeasPerDirection,
        }
      ]
    }

    return (
    <div className="statistic-section">
      <h4>Распределение идей проекта по направлениям</h4>
      <Bar 
        data={data}
        options={{
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }}
      />
    </div>
    )
  }

  private renderPartisipantsStatistic() {
    const participantsAge = this.state.participants.map(p => GetDateDistance(Date.now(), p.DateOfBirth))
    const avgAge = Math.floor(participantsAge.reduce((prev, val) => prev + val, 0) / participantsAge.length);
    const maleCount = this.state.participants.filter(p => p.Sex === 1).length;
    const femaleCount = this.state.participants.filter(p => p.Sex === 2).length;

    const data = {
      labels: ["Мужчины", "Женщины"],
      datasets: [{
        data: [maleCount, femaleCount],
        backgroundColor: [
          '#FF6384',
          '#36A2EB'
          ],
          hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB'
          ]
      }]
    }

    const options = {
      tooltips: {
        callbacks: {
          label: (tooltipItem: any, data: any) => {
            let dataset = data.datasets[tooltipItem.datasetIndex];
            let meta = dataset._meta[Object.keys(dataset._meta)[0]];
            let total = meta.total;
            let currentValue = dataset.data[tooltipItem.index];
            let percentage = parseFloat((currentValue/total*100).toFixed(1));
            return percentage + '%';
          },
          title: (tooltipItem: any, data: any) => {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    }

    return (
      <div className="statistic-section">
        <h4>Статистика участников проекта</h4>
        <div className="average-age">
          <span><span className="highlight">{avgAge}</span> {GetYearSpelling(avgAge)} cредний возраст участников </span>
        </div>
        <Pie data={data} options={options} />
      </div>
    );
  }

  private renderActiveParticipants() {
    let comments: IdeaComment[] = [];
    this.props.project.ProjectDirection.forEach(d => {
      d.DirectionIdea.forEach(i => {
        comments = [...comments, ...i.IdeaComment!];
      });
    });

    let userComments = new Map();

    comments.forEach(c => {
      userComments.set(c.UserId, userComments.get(c.UserId) ? userComments.get(c.UserId) + 1 : 1);
    });

    const sortedUserComments = Array.from(userComments).sort((a, b) => b[1] - a[1]).slice(0, 3);


    return(
      <div className="statistic-section">
        <h4>Самые активные участники проекта</h4>
        <div className="active-users">
          {sortedUserComments.map((item, index) => {
            const user = this.state.participants && this.state.participants.find(u => u.Id === item[0])!;
            return (
              user && <div className="user" key={index} style={{marginLeft: `${index * 100}px`}}>
                <UserAvatar  source={user.UserAvatar || GetDefaultAvatar(user.Sex)} size="s"/>
                <div className="info">
                  <NavLink to={`/profile/${user.Id}`}>
                    <h4>{user.FirstName} {user.LastName}</h4>
                  </NavLink>
                  <span>{item[1]} {GetCommentarySpelling(item[1])}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}