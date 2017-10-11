import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/User'
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  // API interface for User
    constructor(private http: Http) {}

    // TODO: config this
    private serverApi= 'http://localhost:3000/user';

    private streams = {
      allUsers: new Subject<any>(),
      addUser: new Subject<any>(),
      deleteUser: new Subject<any>(),
      updateUser: new Subject<any>(),
      getUser: new Subject<any>()
    };

    // return observables with initial result to invoker and also stream to all subscribers
    public getSubscription(streamName: string): Observable<any> {
      // return the stream or, if not found, warn but do not break
      // provide subscription to anyone who wants to sync with user data
      const stream = this.streams[streamName] || new Subject<any>();

      if (!this.streams[streamName]) {
        console.warn(streamName, 'Stream unavailable');
      }

      return stream.asObservable();
    }

    // GET
    public getAllUsers(): Observable<any> {
      let URI = `${this.serverApi}/all`;

      const observable = this.http.get(URI)
        .map(res => res.json());

      observable.subscribe(res => this.streams.allUsers.next(res));

      return observable;
    }

    public getUserById(userId): Observable<any> {
      let URI = `${this.serverApi}/${userId}`;

      const observable = this.http.get(URI)
        .map(res => res.json());

      observable.subscribe(res => this.streams.getUser.next(res));

      return observable;
    }

    // POST
    public addUser(user: User): Observable<any> {
      let URI = `${this.serverApi}/add`;
      let headers = new Headers;
      let body = JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName
      });

      headers.append('Content-Type', 'application/json');

      const observable = this.http.post(URI, body, { headers })
        .map(res => res.json());

      observable.subscribe(res => this.streams.addUser.next(res));

      return observable;
    }

    public updateUser(updatedUser: User): Observable<any> {
      // expect updatedUser to have _id
      let URI = `${this.serverApi}/update`;
      let headers = new Headers;
      let body = JSON.stringify(updatedUser);

      headers.append('Content-Type', 'application/json');

      const observable = this.http.post(URI, body , { headers })
        .map(res => res.json());

      observable.subscribe(res => this.streams.updateUser.next(res));

      return observable;
    }

    // DELETE
    public deleteUser(userId: string): Observable<any> {
      let URI = `${this.serverApi}/delete/${userId}`;
      let headers = new Headers;

      headers.append('Content-Type', 'application/json');

      const observable = this.http.delete(URI, { headers })
        .map(res => res.json());

      observable.subscribe(res => this.streams.deleteUser.next(res));

      return observable;
    }
}
