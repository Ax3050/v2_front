import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInvestigatorComponent } from './project-investigator.component';

describe('ProjectInvestigatorComponent', () => {
  let component: ProjectInvestigatorComponent;
  let fixture: ComponentFixture<ProjectInvestigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectInvestigatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInvestigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
