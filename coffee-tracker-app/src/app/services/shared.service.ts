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
    // TODO: all subscriptions should be of type <any> including success bool and user payload
    private addUserStream: Subject<any> = new Subject<any>();
    private allUsersStream: Subject<User[]> = new Subject<User[]>();

    public getAllUsersSubscription() {
      // provide subscription to anyone who wants to sync with all user data
      return this.allUsersStream.asObservable();
    }

    public getAllUsers() {
      // return observable with initial result to invoker and also stream to all subscribers
      this.userService.getAllUsers().subscribe(response =>
        this.allUsersStream.next(response)
      );
    }

    public getAddUserSubscription() {
      return this.addUserStream.asObservable();
    }

    public addUser(user: User) {
      this.userService.addUser(user).subscribe(response =>
        this.addUserStream.next(response)
      );
    }

//     public getUserById(userId): Observable<User> {
//       let URI = `${this.serverApi}/${userId}`;

//       return this.http.get(URI)
//         .map(res => res.json())
//         .map(res => <User>res.user);
//     }

//     // POST
//     public addUser(user: User): Observable<any> {
//         let URI = `${this.serverApi}/add`;
//         let headers = new Headers;
//         let body = JSON.stringify({
//           firstName: user.firstName,
//           lastName: user.lastName
//         });

//         headers.append('Content-Type', 'application/json');

//         return this.http.post(URI, body, { headers })
//           .map(res => res.json())
//           .map(res => res.newUser);
//     }

//     public updateUser(updatedUser: User) {
//       // expect updatedUser to have _id
//       let URI = `${this.serverApi}/update`;
//       let headers = new Headers;
//       let body = JSON.stringify(updatedUser);

//       headers.append('Content-Type', 'application/json');

//       return this.http.post(URI, body , { headers })
//         .map(res => res.json());
//     }

//     // DELETE
//     public deleteUser(userId: string) {
//         let URI = `${this.serverApi}/${userId}`;
//         let headers = new Headers;

//         headers.append('Content-Type', 'application/json');

//         return this.http.delete(URI, { headers })
//           .map(res => res.json());
//     }
}
