import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // sets the active user

  // state
  private title = 'Coffee Tracker';
  private selectedUserId = '';

  selectUser(userId) {
    console.log('set active user to', userId);
    this.selectedUserId = userId;
  }
}
