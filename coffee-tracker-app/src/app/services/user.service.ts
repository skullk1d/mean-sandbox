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

    // GET
    public getAllUsers(): Observable<User[]> {
        let URI = `${this.serverApi}/all`;

        return this.http.get(URI)
          .map(res => res.json())
          .map(res => <User[]>res.users);
    }

    public getUserById(userId): Observable<User> {
      let URI = `${this.serverApi}/${userId}`;

      return this.http.get(URI)
        .map(res => res.json())
        .map(res => <User>res.user);
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

        return this.http.post(URI, body, { headers })
          .map(res => res.json());
    }

    public updateUser(updatedUser: User): Observable<any> {
      // expect updatedUser to have _id
      let URI = `${this.serverApi}/update`;
      let headers = new Headers;
      let body = JSON.stringify(updatedUser);

      headers.append('Content-Type', 'application/json');

      return this.http.post(URI, body , { headers })
        .map(res => res.json());
    }

    // DELETE
    public deleteUser(userId: string) {
        let URI = `${this.serverApi}/${userId}`;
        let headers = new Headers;

        headers.append('Content-Type', 'application/json');

        return this.http.delete(URI, { headers })
          .map(res => res.json());
    }
}
