import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../services/user.service';
import { User } from '../models/User'

import 'rxjs/add/operator/map';

@Injectable()
export class SharedService {
    constructor(private userService: UserService) {}

    // TODO: config this
    private serverApiUser = 'http://localhost:3000/user';

    // all components using this service can stay in sync with latest user data by subscribing to these
    // Observable string sources
    // TODO: all subscriptions should be of type <any> including success bool and request payload
    // TODO: expose enum?
    private streams = {
      allUsers: new Subject<User[]>(),
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

    public getAllUsers(): Observable<User[]> {
      this.userService.getAllUsers().subscribe(res =>
        this.streams.allUsers.next(res)
      );

      return this.streams.allUsers.asObservable();
    }

    public addUser(user: User): Observable<any> {
      this.userService.addUser(user).subscribe(res =>
        this.streams.addUser.next(res)
      );

      return this.streams.addUser.asObservable();
    }

    public deleteUser(userId: string): Observable<any> {
      this.userService.deleteUser(userId).subscribe(res =>
        this.streams.deleteUser.next(res)
      );

      return this.streams.deleteUser.asObservable();
    }

    public updateUser(user: User): Observable<any> {
      this.userService.updateUser(user).subscribe(res =>
        this.streams.updateUser.next(res)
      );

      return this.streams.updateUser.asObservable();
    }

    public getUserById(userId: string): Observable<any> {
      // makes request, notifies subscribers, and returns Observable
      this.userService.getUserById(userId).subscribe(res =>
        this.streams.getUser.next(res)
      );

      return this.streams.getUser.asObservable();
    }
}
