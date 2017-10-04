import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})

export class UserAddComponent implements OnInit {
  @Output() addUser: EventEmitter<User> = new EventEmitter<User>();

  private newUser: User;

  constructor(private userServ: UserService) { }

  newFirstName: string = '';
  newLastName: string = '';

  ngOnInit() {
    this.newUser = {
        _id: '',
        displayName: '',
        firstName: '',
        lastName: ''
    };
  }

  public onSubmit() {
    this.userServ.addUser(this.newUser).subscribe(response => {
        if (response.success) {
          // update the parent components
          this.addUser.emit(this.newUser);
        }
    },);
  }
}
