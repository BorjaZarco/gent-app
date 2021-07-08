import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDiagramComponent } from './family-diagram.component';

describe('FamilyDiagramComponent', () => {
  let component: FamilyDiagramComponent;
  let fixture: ComponentFixture<FamilyDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyDiagramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
