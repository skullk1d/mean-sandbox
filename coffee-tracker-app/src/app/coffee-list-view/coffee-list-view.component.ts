import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ListService } from '../services/list.service';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { List } from '../models/List';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-coffee-list-view',
  templateUrl: './coffee-list-view.component.html',
  styleUrls: ['./coffee-list-view.component.scss']
})
export class CoffeeListViewComponent implements OnInit {

  // state
  private selectedUserId: string = '';
  private activeUser: User;
  private activeCoffeeList: List;
  private listStreams: Array<[string, Function]> = [
    ['getCoffeeList', this.onGetCoffeeList],
    ['addCoffeeList', this.onAddCoffee],
    ['addCoffee', this.onAddCoffee],
    ['deleteCoffee', this.onDeleteCoffee]
  ];
  private userStreams: Array<[string, Function]> = [
    ['getUser', this.onGetUser]
  ];

  private subscriptions: Subscription[] = [];

  // activeCoffeeList$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private userService: UserService
  ) {
    this.listStreams.forEach((streamAndHandler: [string, Function]) => {
      this.subscriptions.push(
        this.listService.getSubscription(streamAndHandler[0])
        .subscribe(streamAndHandler[1].bind(this))
      );
    });

    this.userStreams.forEach((streamAndHandler: [string, Function]) => {
      this.subscriptions.push(
        this.userService.getSubscription(streamAndHandler[0])
        .subscribe(streamAndHandler[1].bind(this))
      );
    });
  }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('userId');
      if (!this.activeUser) {
        this.userService.getUserById(this.selectedUserId); // must return Observable
      }
      return this.listService.getListForUser(this.selectedUserId);
    }).subscribe(this.onGetCoffeeList.bind(this));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onGetUser(res) {
    if (res.success) {
       // init our model of edited names when we get res.user
      this.activeUser = res.user;
    } else {
      console.warn(res.message);
    }
  }

  requestAddCoffee(userId) {
    // if this user doesn't have a list, first create it before adding to it
    if (!this.activeCoffeeList) {
      this.listService.addList({
        ownerId: userId,
        coffees: [ new Date().toUTCString() ]
      });
    } else {
      this.listService.addToList(
        this.activeCoffeeList._id,
        [ new Date().toUTCString() ]
      );
    }
  }

  requestDeleteCoffee(listId, index) {
    this.listService.deleteFromList(
      this.activeCoffeeList._id,
      index
    );
  }

  onAddCoffee(res) {
    if (res.success) {
      this.activeCoffeeList = res.list;
    } else {
      console.warn(res.message);
    }
  }

  onDeleteCoffee(res) {
    if (res.success) {
      this.activeCoffeeList = res.list;
    } else {
      console.warn(res.message);
    }
  }

  onGetCoffeeList(res) {
    if (res.success) {
      // support only one list at a time for now
      this.activeCoffeeList = res.lists[0];
    } else {
      console.warn(res.message);
    }
  }
}
