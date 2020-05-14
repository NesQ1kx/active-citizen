import React, { Component } from "react";
import { Page, AcInput, AcTextArea, AcFileInput, AcButton } from "../../components";
import { FormInput, AddNewsModel, EventType } from "../../types";
import { requireValidationFunction } from "../../constants";
import { LoadingService, CommonService, ToastService } from "../../services";
import { RouterService } from "../../services/Router.service";
import { Autobind } from "../../helpers";
import { isValid } from "date-fns";

interface FormFields {
  newsTitle: FormInput;
  newsText: FormInput;
  newsImage: FormInput;
}

interface Props {}

interface State {
  formState: FormFields;
  isFormValid: boolean;
}


export class AddNews extends Component {
  private loadingService: LoadingService;
  private routerService: RouterService;
  private commonService: CommonService;
  private toastService: ToastService;

  public state: State = {
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

  public render() {
    return (
      <Page title="Добавить новость">
        <div className="add-news">
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
            title="Изображение для новости"
            onChange={(value) => this.inputChange("newsImage", value, true)}
          />
          <AcButton title="Загрузить" type="primary" onClick={this.addNews}/>
        </div>
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
  private addNews() {
    const model: AddNewsModel = {
      Title: this.state.formState.newsTitle.value,
      Text: this.state.formState.newsText.value,
      Image: this.state.formState.newsImage.value,
      CreateDate: Date.now(),
    }

    this.loadingService.changeLoader(true);
    this.commonService.addNews(model).then(() => {
      this.toastService.changeEvent({ message: "Новость успешно загружена", type: EventType.Success, show: true });
      this.loadingService.changeLoader(false);
      this.routerService.redirect("/");
    }, () => {
      this.toastService.changeEvent({ message: "Не удалось загрузить новость", type: EventType.Error, show: true });
      this.loadingService.changeLoader(false);
    });
  }
}