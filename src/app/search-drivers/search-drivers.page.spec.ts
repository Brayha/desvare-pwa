import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchDriversPage } from './search-drivers.page';

describe('SearchDriversPage', () => {
  let component: SearchDriversPage;
  let fixture: ComponentFixture<SearchDriversPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
