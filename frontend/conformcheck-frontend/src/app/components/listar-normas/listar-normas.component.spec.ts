import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNormasComponent } from './listar-normas.component';

describe('ListarNormasComponent', () => {
  let component: ListarNormasComponent;
  let fixture: ComponentFixture<ListarNormasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarNormasComponent]
    });
    fixture = TestBed.createComponent(ListarNormasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
