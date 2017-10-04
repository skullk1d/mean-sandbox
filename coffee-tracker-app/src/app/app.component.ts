import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // state
  private title = 'Coffee Tracker';
  private selectedUserId = '';

  selectUser(userId) {
    console.log('set active user to', userId)
    this.selectedUserId = userId
  }
}
