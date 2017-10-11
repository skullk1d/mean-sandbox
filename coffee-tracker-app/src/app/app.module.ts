import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MatToolbarModule, MatButtonModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileSelectComponent } from './user-profile-select/user-profile-select.component';
import { CoffeeListViewComponent } from './coffee-list-view/coffee-list-view.component';

import { ListService } from './services/list.service';
import { UserService } from './services/user.service';
import { UserAddComponent } from './user-add/user-add.component';

const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'profile/:userId', component: UserProfileComponent },
  { path: 'coffees/:userId', component: CoffeeListViewComponent },
  { path: 'register', component: UserAddComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    UserAddComponent,
    UserProfileComponent,
    UserProfileSelectComponent,
    CoffeeListViewComponent,
    UserAddComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,

    BrowserAnimationsModule,

    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,

    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [ ListService, UserService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
