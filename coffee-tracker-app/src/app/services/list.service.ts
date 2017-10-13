
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { List } from '../models/List'
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class ListService {

  constructor(private http: Http) { }

  // TODO: config this
  private serverApi= 'http://localhost:3000/coffeeList';

  private allLists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  private activeList: Subject<List> = new Subject<List>();
  private deletedListId: Subject<string> = new Subject<string>();

  // expose observables
  public readonly allLists$: Observable<List[]> = this.allLists.asObservable();
  public readonly activeList$: Observable<List> = this.activeList.asObservable();
  public readonly deletedListId$: Observable<string> = this.deletedListId.asObservable();

  // GET
  public getAllLists(): Observable<List[]> {
    let URI = `${this.serverApi}/all`;

    this.http.get(URI)
      .map(res => res.json())
      .catch(this.throwError)
      .subscribe(res => {
        let lists: List[] = this.allLists.getValue();

        if (res.success) {
          lists = res.lists;

          this.allLists.next(lists);
        } else {
          console.warn(res.message);
        }
      }
    );

    return this.allLists$;
  }

  public getListForUser(userId): Observable<List> {
    let URI = `${this.serverApi}/forUser/${userId}`;

    this.http.get(URI)
      .map(res => res.json()).catch(this.throwError)
      .catch(this.throwError)
      .subscribe(res => {
        if (res.success) {
          // service may return multiple lists for a user but for now we support only one list per user
          this.activeList.next(res.lists[0]);
        } else {
          console.warn(res.message);
        }
      });

    return this.activeList$;
  }

  // POST
  public addList(list: List): Observable<List> {
    let URI = `${this.serverApi}/add`;
    let headers = new Headers;
    let body = JSON.stringify({
      ownerId: list.ownerId,
      description: list.description,
      coffees: list.coffees
    });

    headers.append('Content-Type', 'application/json');

    this.http.post(URI, body , { headers })
      .map(res => res.json()).catch(this.throwError)
      .catch(this.throwError)
      .subscribe(res => {
        let lists: List[] = this.allLists.getValue();

        if (res.success) {
          lists.push(res.list);

          this.allLists.next(lists);
          this.activeList.next(res.list);
        } else {
          console.warn(res.message);
        }
      });

    return this.activeList$;
  }

  public addToList(listId: string, coffees: string[]): Observable<List> {
    let URI = `${this.serverApi}/addTo`;
    let headers = new Headers;
    let body = JSON.stringify({
      id: listId,
      coffees
    });

    headers.append('Content-Type', 'application/json');

    this.http.post(URI, body , { headers })
      .map(res => res.json()).catch(this.throwError)
      .catch(this.throwError)
      .subscribe(res => {
        if (res.success) {
          this.activeList.next(res.list);
        } else {
          console.warn(res.message);
        }
      });

    return this.activeList$;
  }

  // DELETE
  public deleteList(listId: string): Observable<string> {
      let URI = `${this.serverApi}/delete/${listId}`;
      let headers = new Headers;

      headers.append('Content-Type', 'application/json');

      this.http.delete(URI, { headers })
        .map(res => res.json()).catch(this.throwError)
        .catch(this.throwError)
        .subscribe(res => {
          let lists: List[] = this.allLists.getValue();

          if (res.success) {
            lists = lists.filter(list => list._id !== res.listId);

            this.allLists.next(lists);
            this.deletedListId.next(listId);
          } else {
            console.warn(res.message);
          }
        });

      return this.deletedListId$;
  }

  public deleteFromList(listId: string, index: number): Observable<List> {
    let URI = `${this.serverApi}/deleteFrom`;
    let headers = new Headers;
    let body = JSON.stringify({
      id: listId,
      idx: index
    });

    headers.append('Content-Type', 'application/json');

    // NOTE: in delete request body is optional
    this.http.delete(URI, { headers, body })
      .map(res => res.json()).catch(this.throwError)
      .catch(this.throwError)
      .subscribe(res => {
        if (res.success) {
          this.activeList.next(res.list);
        } else {
          console.warn(res.message);
        }
      });

    return this.activeList$;
  }

  public throwError(res: Response): ErrorObservable {
    // handles standard http errors
    console.error(res);
    return Observable.throw(res || 'Server error');
  }
}
