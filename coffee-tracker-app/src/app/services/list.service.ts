
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { List } from '../models/List'
import 'rxjs/add/operator/map';

@Injectable()
export class ListService {

  constructor(private http: Http) { }

  // TODO: config this
  private serverApi= 'http://localhost:3000/coffeeList';

  private streams = {
    allCoffeeLists: new Subject<any>(),
    getCoffeeList: new Subject<any>(),
    addCoffeeList: new Subject<any>(),
    addCoffee: new Subject<any>(),
    deleteCoffeeList: new Subject<any>(),
    deleteCoffee: new Subject<any>()
  };

  public getSubscription(streamName: string): Observable<any> {
    const stream = this.streams[streamName] || new Subject<any>();

    if (!this.streams[streamName]) {
      console.warn(streamName, 'Stream unavailable');
    }

    return stream.asObservable();
  }

  public getAllLists():Observable<List[]> {
      let URI = `${this.serverApi}/all`;

      const observable = this.http.get(URI)
        .map(res => res.json());

      observable.subscribe(res => this.streams.allCoffeeLists.next(res));

      return observable;
  }

  public getListForUser(userId):Observable<List[]> {
    let URI = `${this.serverApi}/forUser/${userId}`;

    const observable = this.http.get(URI)
      .map(res => res.json());

    observable.subscribe(res => this.streams.getCoffeeList.next(res));

    return observable;
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

      const observable = this.http.post(URI, body , { headers })
        .map(res => res.json());

      observable.subscribe(res => this.streams.addCoffeeList.next(res));

      return observable;
  }

  public addToList(listId: string, coffees: string[]) {
    let URI = `${this.serverApi}/addTo`;
    let headers = new Headers;
    let body = JSON.stringify({
      id: listId,
      coffees
    });

    headers.append('Content-Type', 'application/json');

    const observable = this.http.post(URI, body , { headers })
      .map(res => res.json());

    observable.subscribe(res => this.streams.addCoffee.next(res));

    return observable;
  }

    public deleteList(listId: string) {
        let URI = `${this.serverApi}/delete/${listId}`;
        let headers = new Headers;

        headers.append('Content-Type', 'application/json');

        const observable = this.http.delete(URI, { headers })
          .map(res => res.json());

        observable.subscribe(res => this.streams.deleteCoffeeList.next(res));

        return observable;
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
      const observable = this.http.delete(URI, { headers, body })
        .map(res => res.json());

      observable.subscribe(res => this.streams.deleteCoffee.next(res));

      return observable;
    }
}
