import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { User } from '../models/User';
import { List } from '../models/List';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-coffee-list-view',
  templateUrl: './coffee-list-view.component.html',
  styleUrls: ['./coffee-list-view.component.css']
})
export class CoffeeListViewComponent implements OnInit {

  // state
  private selectedUserId: string = '';
  private activeUser: User;
  private activeCoffeeList: List;
  private getUserSubscription: Subscription;

  // activeCoffeeList$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.getUserSubscription = this.sharedService.getSubscription('getUser').subscribe(this.onGetUser.bind(this));
  }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('userId');
      if (!this.activeUser) {
        this.sharedService.getUserById(this.selectedUserId); // must return Observable
      }
      return this.sharedService.getListForUser(this.selectedUserId);
    }).subscribe(this.onGetCoffeeList.bind(this));
  }

  onGetUser(res) {
    if (!res.user) {
      return;
    }

    // init our model of edited names when we get res.user
    this.activeUser = res.user;
  }

  requestAddCoffee(userId) {
    // if this user doesn't have a list, first create it before adding to it
    if (!this.activeCoffeeList) {
      this.sharedService.addCoffeeList({
        ownerId: userId,
        coffees: [ new Date().toUTCString() ]
      }).subscribe(this.onAddCoffee.bind(this));
    } else {
      this.sharedService.addCoffee(
        this.activeCoffeeList._id,
        [ new Date().toUTCString() ]
      ).subscribe(this.onAddCoffee.bind(this));
    }
  }

  requestDeleteCoffee(listId, index) {
    this.sharedService.deleteFromCoffeeList(
      this.activeCoffeeList._id,
      index
    ).subscribe(this.onDeleteCoffee.bind(this));
  }

  onAddCoffee(res) {
    if (res.success) {
      this.activeCoffeeList = res.list;
      console.log('Added coffee');
    }
  }

  onDeleteCoffee(res) {
    this.activeCoffeeList = res.list;
    console.log('Deleted coffee');
  }

  onGetCoffeeList(res) {
    if (res.success) {
      // support only one list at a time for now
      this.activeCoffeeList = res.lists[0];
    }
  }
}
