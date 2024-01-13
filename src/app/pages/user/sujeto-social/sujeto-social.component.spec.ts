import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SujetoSocialComponent } from './sujeto-social.component';

describe('SujetoSocialComponent', () => {
  let component: SujetoSocialComponent;
  let fixture: ComponentFixture<SujetoSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SujetoSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SujetoSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
