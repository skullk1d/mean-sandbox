import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
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

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

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

  ngOnDestroy() {
    if (this.addUserSubscription) {
      this.addUserSubscription.unsubscribe();
    }
  }

  onAddUser() {
    this.router.navigate(['/']);
  }

  public onSubmit() {
    Object.assign(this.newUser, {
      firstName: this.newFirstName,
      lastName: this.newLastName
    });

   this.addUserSubscription = this.userService.addUser(this.newUser).subscribe(this.onAddUser.bind(this));
  }
}
