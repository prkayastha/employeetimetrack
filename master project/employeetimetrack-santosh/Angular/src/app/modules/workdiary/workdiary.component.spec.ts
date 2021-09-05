import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkdiaryComponent } from './workdiary.component';

describe('WorkdiaryComponent', () => {
  let component: WorkdiaryComponent;
  let fixture: ComponentFixture<WorkdiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkdiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkdiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
