import { Routes } from '@angular/router';
import { ResourceComponent } from './resource/resource.component';
import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';
import { AddVehiclesComponent } from './add-vehicles/add-vehicles.component';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' }, 
  { path: 'resource', component: ResourceComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'booking/add', component: AddBookingComponent },
  {path: 'booking/edit/:id', component: BookingEditComponent },
  { path: 'resource/vehicles/add', component: AddVehiclesComponent },
  { path: 'resource/equipment/add', component: AddEquipmentComponent },
  {path: 'resource/staff/add', component: AddStaffComponent},
  {path: 'resource/vehicles/edit/:id', component: VehicleEditComponent},

];
