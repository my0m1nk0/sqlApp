
import { Component, effect } from '@angular/core';
import { DatabaseService,User } from '../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  newUserName='';
  users = this.database.getUsers();

  constructor(private database:DatabaseService) {
    effect(()=>{
      console.log('USERS CHANGED',this.users());
    })
  }

  async createUser(){
    await this.database.addUser(this.newUserName);
    this.newUserName="";
  }

  updateUser(user:User){
    const active = user.active ? 1 : 0;
    this.database.updateUserById(user.id.toString(),active);
  }

  deleteUser(user:User){
    this.database.deleteUserById(user.id.toString());
  }

}
