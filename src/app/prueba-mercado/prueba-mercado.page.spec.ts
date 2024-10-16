import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PruebaMercadoPage } from './prueba-mercado.page';

describe('PruebaMercadoPage', () => {
  let component: PruebaMercadoPage;
  let fixture: ComponentFixture<PruebaMercadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaMercadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
