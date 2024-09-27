import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalAddressComponent } from './modal-address.component';

describe('ModalAddressComponent', () => {
  let component: ModalAddressComponent;
  let fixture: ComponentFixture<ModalAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
