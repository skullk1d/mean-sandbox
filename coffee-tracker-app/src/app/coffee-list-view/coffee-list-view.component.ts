import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-coffee-list-view',
  templateUrl: './coffee-list-view.component.html',
  styleUrls: ['./coffee-list-view.component.css']
})
export class CoffeeListViewComponent implements OnInit {

  // state
  private selectedUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userServ: UserService
  ) { }

  user$: Observable<User>;

  ngOnInit() {
    this.user$ = this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('id');
      return this.userServ.getUserById(this.selectedUserId)
    });
  }
}
