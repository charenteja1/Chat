import {Component}            from '@angular/core';
import {Subject}              from 'rxjs/Rx';
import {Message}              from '../data/message';
import {AppDataService}       from '../service/appdata.service';
import {ChatWebsocketService} from '../service/chatwebsocket.service'

const WEBSOCKET_URL = 'ws://localhost:8080/reception';

@Component({
  selector: 'chat-stream',
  templateUrl: '../template/chatstream.component.html',
  styleUrls: ['../style/chatstream.component.css']
})
export class ChatStreamComponent {

  private message: string = ''; 
  private messages: Subject<Message>;
  private publishedMessage: Message[] = new Array();
  private showTypingIndicator: boolean = false;
  private typingUser: string;
  private loggedinUserId: number;
  random:any={};
  title:any =document.title;
  intv:any;
  constructor(chatWSService: ChatWebsocketService,
              private appDataService: AppDataService) {
              //   let i=0;
              //   setInterval(() => {
                   
              //     document.title = 'New title'+ i;
              //     i++;
              // }, 3000 );
              
   
              
              // setInterval(blink, 3000);
                this.random.color = this.getRandomColor();
    this.messages = <Subject<Message>>chatWSService
                        .connect(WEBSOCKET_URL)
                        .map((response: MessageEvent): Message => {
                          let data = JSON.parse(response.data);
                          let message: Message = {
                            type: data.type,
                            from: data.from,
                            fromUserName: data.fromUserName,
                            message: data.message
                          };
                          return message;
                        });

    this.messages.subscribe(message => {
      if (message.type == "CHAT_MESSAGE") {
        this.publishedMessage.push(message);
        console.log(this.loggedinUserId , message.from)
            if(this.loggedinUserId!=message.from){
        //blink tab
        window.clearInterval(this.intv);
  this.title = document.title;
  this.intv = window.setInterval(function () {
   document.title = document.title === '' ? 'New Message' : '';
}, 750);
    }
      } else if (message.type == "USER_TYPING") {
        this.showUserTypingIndicator(message.fromUserName);
        setTimeout(this.hideUserTypingIndicator.bind(this), 1000);
      } else if (message.type == "USER_ONLINE") {
        // not yet implemented
      } else if (message.type == "USER_TYPING") {
        // not yet implemented
      }
    });

    this.loggedinUserId = this.appDataService.userId;
  }


// call this to stop the blinking
 stopBlink() {
    window.clearInterval(this.intv);
    document.title = this.title;
}
//end of blink
  private sendMessage() {
    let msg = this.message;
    if (msg == '' || msg == undefined) return;

    let message: Message = {
      type: 'CHAT_MESSAGE',
      from: this.appDataService.userId,
      fromUserName: this.appDataService.userName,
      message: msg
    }
    this.messages.next(message);
    this.publishedMessage.push(message);
    console.log(message)
//     if(this.message!=''){
//         //blink tab
//   this.title = document.title;
//   this.intv = window.setInterval(function () {
//    document.title = document.title === '' ? 'New Message' : '';
// }, 750);
//     }
    this.message = '';
  }

  private sendTypeIndicator() {
    let message: Message = {
      type: 'USER_TYPING',
      from: this.appDataService.userId,
      fromUserName: this.appDataService.userName,
      message: null
    }
    this.messages.next(message);
  }

  private showUserTypingIndicator(userName: string) {
    this.typingUser = userName;
    this.showTypingIndicator = true;
  }

  private hideUserTypingIndicator() {
    if (this.showTypingIndicator) {
      this.showTypingIndicator = false;
    }
  }
  getRandomColor()
  {
      var color = "#";
      for (var i = 0; i < 3; i++)
      {
          var part = Math.round(Math.random() * 255).toString(16);
          color += (part.length > 1) ? part : "0" + part;
      }
      return color;
  }
  
}