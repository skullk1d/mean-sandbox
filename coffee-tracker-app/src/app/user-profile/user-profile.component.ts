import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  // state
  private selectedUserId: string = '';
  private activeUser: User;

  editFirstName = '';
  editLastName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userServ: UserService
  ) { }

  user$: Observable<User>;

  ngOnInit() {
    this.user$ = this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('id');
      return this.userServ.getUserById(this.selectedUserId);
    });

    this.user$.subscribe(res => {
      this.activeUser = res[0];
    });
  }

  onUpdateUser() {
    console.log('onUpdateUser', this.editFirstName, this.editLastName)

    if (this.editFirstName !== this.activeUser.firstName) {
      this.activeUser.firstName = this.editFirstName;
    }
    if (this.editLastName !== this.activeUser.lastName) {
      this.activeUser.lastName = this.editLastName;
    }

    this.userServ.updateUser(this.activeUser);
  }
}
