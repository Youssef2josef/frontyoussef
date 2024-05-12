import { Component, OnInit } from '@angular/core';
import { ChatWithBot, ResponseModel } from '../../../api/gpt-response';
import { gptModels } from '../../../api/constants';
import { Configuration, OpenAIApi } from 'openai';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.css']
})
export class CustomerSupportComponent implements OnInit {
  chatConversation: ChatWithBot[] = [];
  response!: ResponseModel | undefined;
  gptModels = gptModels
  promptText = '';
  showSpinner = false;

  constructor() { }

  ngOnInit(): void {
  }

  checkResponse() {
    this.pushChatContent(this.promptText, 'You', 'person');
    this.invokeGPT();
  }


  pushChatContent(content: string, person: string, cssClass: string) {
    const chatToPush: ChatWithBot = { person: person, response: content, cssClass: cssClass };
    this.chatConversation.push(chatToPush);
  }


  getText(data: string) {
    return data.split('\n').filter(f => f.length > 0);
  }

  async invokeGPT() {


    if (this.promptText.length < 2)
      return;



    try {
      this.response = undefined;
      let configuration = new Configuration({ apiKey: environment.apiKey });
      let openai = new OpenAIApi(configuration);

      let requestData = {
        model: 'gpt-3.5-turbo',//'text-davinci-003',//"text-curie-001",
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        prompt: this.promptText,//this.generatePrompt(animal),
        temperature: 0.95,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
      this.showSpinner = true;
      let apiResponse = await openai.createCompletion(requestData);

      this.response = apiResponse.data as ResponseModel;
      this.pushChatContent(this.response.choices[0].text.trim(), 'Mr Bot', 'bot');
      debugger;
      this.showSpinner = false;
    } catch (error: any) {
      this.showSpinner = false;
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);

      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);

      }
    }
  }

}
