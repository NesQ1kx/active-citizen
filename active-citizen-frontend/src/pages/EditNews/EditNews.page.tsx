import React, { Component } from "react";
import { Page, AcLoader, AcInput, AcTextArea, AcFileInput, AcButton } from "../../components";
import { FormInput, EventType } from "../../types";
import { LoadingService, RouterService, CommonService, ToastService } from "../../services";
import { News } from "../../models/News";
import { Autobind } from "../../helpers";

interface FormFields {
  newsTitle: FormInput;
  newsText: FormInput;
  newsImage: FormInput;
}

interface Props {
  match: any;
}

interface State {
  formState: FormFields;
  isFormValid: boolean;
  news?: News;
}

export class EditNews extends Component<Props, State> {
  private loadingService: LoadingService;
  private routerService: RouterService;
  private commonService: CommonService;
  private toastService: ToastService;

  public state: State = {
    news: undefined,
    formState: {
      newsTitle: {
        value: '',
        valid: true,
        validationFunctions: [],
      },
      newsText: {
        value: '',
        valid: true,
        validationFunctions: []
      },
      newsImage: {
        value: '',
        valid: true,
        validationFunctions: [],
      }
    },
    isFormValid: false,
  }

  constructor(props: Props) {
    super(props);
    this.loadingService = LoadingService.instance;
    this.routerService = RouterService.instance;
    this.commonService = CommonService.instance;
    this.toastService = ToastService.instance;
  }

  public componentDidMount() {
    this.loadingService.changeLoader(true);
    this.commonService.getNewsById(this.props.match.params.newsId).then((news: any) => {
      this.setState({ news }, () => {
        this.setState({
          formState: {
            newsText: { ...this.state.formState.newsText, value: this.state.news!.Text },
            newsTitle: { ...this.state.formState.newsTitle, value: this.state.news!.Title },
            newsImage: { ...this.state.formState.newsImage, value: this.state.news!.Image },
          }
        });
        this.loadingService.changeLoader(false);
      });
    });
  }

  public render() {
    return (
      <Page title="Редактировать новость">
        <AcLoader>
          <div className="edit-news">
            <AcInput
              label="Заголовок новости"
              formInput={this.state.formState.newsTitle}
              inputType="text"
              onChange={(value, isValid) => this.inputChange("newsTitle", value, isValid)}
            />
            <AcTextArea
              label="Текст новости"
              formInput={this.state.formState.newsText}
              onChange={(value, isValid) => this.inputChange("newsText", value, isValid)}
              withHint={true}
              hintText="Форматирование будет сохранено"
            />
            <AcFileInput
              formInput={this.state.formState.newsImage}
              title="Изображение для новости"
              onChange={(value) => this.inputChange("newsImage", value, true)}
            />
            <AcButton title="Сохранить" type="primary" onClick={this.updateNews}/>
          </div>
        </AcLoader>
      </Page>
    );
  }

  @Autobind
  private inputChange(formFiled: keyof FormFields, value: any, isValid: boolean) {
    this.setState({
      formState: {
        ...this.state.formState,
        [formFiled]: { ...this.state.formState[formFiled], value, valid: isValid},
      },
    });
  }

  @Autobind
  private updateNews() {
    const model: News = {
      Id: this.state.news!.Id,
      Text: this.state.formState.newsText.value,
      Title: this.state.formState.newsTitle.value,
      Image: this.state.formState.newsImage.value,
      CreateDate: this.state.news!.CreateDate
    }

    this.loadingService.changeLoader(true);
    this.commonService.updateNews(model).then(() => {
      this.loadingService.changeLoader(false);
      this.toastService.changeEvent({ message: "Новость обновлена", type: EventType.Success, show: true });
      this.routerService.redirect(`/news/${this.state.news!.Id}`);
    }, error => {
      this.toastService.changeEvent({ message: "Не удалось обновить новость", type: EventType.Error, show: true });
      this.loadingService.changeLoader(false);
    });
  }
}