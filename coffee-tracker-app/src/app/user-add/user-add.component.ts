import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../models/User';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})

export class UserAddComponent implements OnInit {
  // builds a new user and requests to add a user
  // @Input() public addUserStream: Subject<User>;

  private newUser: User;
  private addUserSubscription: Subscription;

  constructor(private sharedService: SharedService) {
    this.addUserSubscription = this.sharedService.getAddUserSubscription().subscribe(res => {
      // do stuff based on success/fail of add user
    });
  }

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
    Object.assign(this.newUser, {
      firstName: this.newFirstName,
      lastName: this.newLastName
    });

    this.sharedService.addUser(this.newUser);
  }
}
