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
  private activeUser$: Observable<User>;
  private activeCoffeeList$: Observable<List>;

  private activeCoffeeList: List;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('userId');
      this.activeUser$ = this.userService.getUserById(this.selectedUserId); // must return Observable
      this.activeCoffeeList$ = this.listService.getListForUser(this.selectedUserId);

      // observable from service already handles success, so res mapped to List type
      return this.activeCoffeeList$;
    }).subscribe(this.onGetCoffeeList.bind(this));
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

  onGetCoffeeList(list: List) {
    this.activeCoffeeList = list;
  }
}
