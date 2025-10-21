import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidServicesComponent } from './paid-services.component';

describe('PaidServicesComponent', () => {
  let component: PaidServicesComponent;
  let fixture: ComponentFixture<PaidServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaidServicesComponent]
    });
    fixture = TestBed.createComponent(PaidServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
