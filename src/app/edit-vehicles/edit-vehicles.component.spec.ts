import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVehiclesComponent } from './edit-vehicles.component';

describe('EditVehiclesComponent', () => {
  let component: EditVehiclesComponent;
  let fixture: ComponentFixture<EditVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
