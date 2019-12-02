import {Component}        from '@angular/core';
import {AppService}       from '../service/app.service'
@Component({
  selector: 'users',
  templateUrl: '../template/users.component.html',
  styleUrls: ['../style/user.component.css']
})
export class UsersComponent {

  private users: any = new Array();
  welcomeUser:string;
  constructor(private appService: AppService) {
    this.initUserList();
    this.welcomeUser=sessionStorage.getItem('ngx-webstorage|username')
  }

  private initUserList() {
    this.appService.listUser().then(response => {
      this.users = JSON.parse(response._body);
    });
  }



}