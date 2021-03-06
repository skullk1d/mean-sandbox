
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../models/User'
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  // API interface for User
    constructor(private http: Http) {}

    // TODO: config this
    private serverApi= 'http://localhost:3000/user';

    private allUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
    private activeUser: Subject<User> = new Subject<User>();
    private deletedUserId: Subject<string> = new Subject<string>();

    // expose observables
    public readonly allUsers$: Observable<User[]> = this.allUsers.asObservable();
    public readonly activeUser$: Observable<User> = this.activeUser.asObservable();
    public readonly deletedUserId$: Observable<string> = this.deletedUserId.asObservable();

    // GET
    public getAllUsers(): Observable<User[]> {
      let URI = `${this.serverApi}/all`;

      this.http.get(URI)
        .map(res => res.json())
        .catch(this.throwError)
        .subscribe(res => {
          let users: User[] = this.allUsers.getValue();

          if (res.success) {
            users = res.users;

            this.allUsers.next(users);
          } else {
            console.warn(res.message);
          }
        });

      return this.allUsers$;
    }

    public getUserById(userId): Observable<User> {
      let URI = `${this.serverApi}/${userId}`;

      this.http.get(URI)
        .map(res => res.json())
        .catch(this.throwError)
        .subscribe(res => {
          if (res.success) {
            this.activeUser.next(res.user);
          } else {
            console.warn(res.message);
          }
        });

      return this.activeUser$;
    }

    // POST
    public addUser(user: User): Observable<User> {
      let URI = `${this.serverApi}/add`;
      let headers = new Headers;
      let body = JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName
      });

      headers.append('Content-Type', 'application/json');

      this.http.post(URI, body, { headers })
        .map(res => res.json())
        .catch(this.throwError)
        .subscribe(res => {
          let users: User[] = this.allUsers.getValue();

          if (res.success) {
            users.push(res.newUser);

            this.allUsers.next(users);
            this.activeUser.next(res.newUser);
          } else {
            console.warn(res.message);
          }
        });

      return this.activeUser$;
    }

    public updateUser(updatedUser: User): Observable<User> {
      // expect updatedUser to have _id
      let URI = `${this.serverApi}/update`;
      let headers = new Headers;
      let body = JSON.stringify(updatedUser);

      headers.append('Content-Type', 'application/json');

      this.http.post(URI, body , { headers })
        .map(res => res.json())
        .catch(this.throwError)
        .subscribe(res => {
          let users: User[] = this.allUsers.getValue();

          if (res.success) {
            let userToReplace = users.find(user => user._id === res.updatedUser._id);
            Object.assign(userToReplace, res.updatedUser);

            this.allUsers.next(users);
            this.activeUser.next(res.updatedUser);
          } else {
            console.warn(res.message);
          }
        });

      return this.activeUser$;
    }

    // DELETE
    public deleteUser(userId: string): Observable<string> {
      let URI = `${this.serverApi}/delete/${userId}`;
      let headers = new Headers;

      headers.append('Content-Type', 'application/json');

      const observable = this.http.delete(URI, { headers })
        .map(res => res.json())
        .catch(this.throwError)
        .subscribe(res => {
          let users: User[] = this.allUsers.getValue();

          if (res.success) {
            users = users.filter(user => user._id !== res.userId);

            this.allUsers.next(users);
            this.deletedUserId.next(res.userId);
          } else {
            console.warn(res.message);
          }
        });

      return this.deletedUserId$;
    }

    public throwError(res: Response): ErrorObservable {
      // handles standard http errors
      console.error(res);
      return Observable.throw(res || 'Server error');
    }
}
