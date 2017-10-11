
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { List } from '../models/List'

import 'rxjs/add/operator/map';

@Injectable()
export class ListService {

  constructor(private http: Http) { }

  // TODO: config this
  private serverApi= 'http://localhost:3000/coffeeList';

  public getAllLists():Observable<List[]> {
      let URI = `${this.serverApi}/all`;

      return this.http.get(URI)
        .map(res => res.json())
        .map(res => <List[]>res.lists);
  }

  public getListForUser(userId):Observable<List[]> {
    let URI = `${this.serverApi}/forUser/${userId}`;

    return this.http.get(URI)
      .map(res => res.json());
  }

  public addList(list: List) {
      let URI = `${this.serverApi}/add`;
      let headers = new Headers;
      let body = JSON.stringify({
        ownerId: list.ownerId,
        description: list.description,
        coffees: list.coffees
      });

      headers.append('Content-Type', 'application/json');

      return this.http.post(URI, body , { headers })
        .map(res => res.json());
  }

  public addToList(listId: string, coffees: string[]) {
    let URI = `${this.serverApi}/addTo`;
    let headers = new Headers;
    let body = JSON.stringify({
      id: listId,
      coffees
    });

    headers.append('Content-Type', 'application/json');

    return this.http.post(URI, body , { headers })
      .map(res => res.json());
  }

    public deleteList(listId: string) {
        let URI = `${this.serverApi}/delete/${listId}`;
        let headers = new Headers;

        headers.append('Content-Type', 'application/json');

        return this.http.delete(URI, { headers })
          .map(res => res.json());
    }

    public deleteFromList(listId: string, index: number) {
      let URI = `${this.serverApi}/deleteFrom`;
      let headers = new Headers;
      let body = JSON.stringify({
        id: listId,
        idx: index
      });

      headers.append('Content-Type', 'application/json');

      // NOTE: in delete request body is optional
      return this.http.delete(URI, { headers, body })
        .map(res => res.json());
    }
}
