import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupermarketComponent } from './add-supermarket.component';

describe('AddSupermarketComponent', () => {
  let component: AddSupermarketComponent;
  let fixture: ComponentFixture<AddSupermarketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSupermarketComponent]
    });
    fixture = TestBed.createComponent(AddSupermarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
