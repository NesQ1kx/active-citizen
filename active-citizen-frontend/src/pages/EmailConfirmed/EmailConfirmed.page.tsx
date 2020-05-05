import React, { Component } from "react";
import { Page } from "../../components/common";
import { UserService } from "../../services";
import { RouterService } from "../../services/Router.service";

interface Props {
  match: any;
}

export class EmailComfirmed extends Component<Props> {
  private userService: UserService;
  private routerService: RouterService;

  constructor(props: Props) {
    super(props);
    this.userService = UserService.instance;
    this.routerService = RouterService.instance;
  }

  public componentDidMount() {
    this.userService.confirmEmail(decodeURIComponent(this.props.match.params.token)).then(() => {
      this.routerService.redirect("/");
    });
  }

  public render() {
    return (
      <Page title="Почта подтверждена">
        
      </Page>
    );
  }
}