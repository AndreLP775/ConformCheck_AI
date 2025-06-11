import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNormaComponent } from './upload-norma.component';

describe('UploadNormaComponent', () => {
  let component: UploadNormaComponent;
  let fixture: ComponentFixture<UploadNormaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadNormaComponent]
    });
    fixture = TestBed.createComponent(UploadNormaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
