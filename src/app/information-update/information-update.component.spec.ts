import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationUpdateComponent } from './information-update.component';

describe('InformationUpdateComponent', () => {
  let component: InformationUpdateComponent;
  let fixture: ComponentFixture<InformationUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
