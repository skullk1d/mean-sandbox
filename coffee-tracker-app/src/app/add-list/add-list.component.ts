import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { List } from '../models/List';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})

export class AddListComponent implements OnInit {
  @Output() addList: EventEmitter<List> = new EventEmitter<List>();

  private newList: List;

  constructor(private listServ: ListService) { }

  ngOnInit() {
    this.newList = {
        _id: '',
        ownerId: '',
        description: '',
        coffees: []
    };
  }

  public onSubmit() {
    this.listServ.addList(this.newList).subscribe(response => {
        if (response.success) {
          // update the view-list component
          this.addList.emit(this.newList);
        }
    },);
  }
}
