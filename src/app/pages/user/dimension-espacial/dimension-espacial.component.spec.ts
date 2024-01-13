import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionEspacialComponent } from './dimension-espacial.component';

describe('DimensionEspacialComponent', () => {
  let component: DimensionEspacialComponent;
  let fixture: ComponentFixture<DimensionEspacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensionEspacialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimensionEspacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
