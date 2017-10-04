import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeListViewComponent } from './coffee-list-view.component';

describe('CoffeeListViewComponent', () => {
  let component: CoffeeListViewComponent;
  let fixture: ComponentFixture<CoffeeListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoffeeListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffeeListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
