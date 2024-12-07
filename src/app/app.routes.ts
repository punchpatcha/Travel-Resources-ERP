import { Routes } from '@angular/router';
import { ResourceComponent } from './resource/resource.component';
import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';
import { AddVehiclesComponent } from './add-vehicles/add-vehicles.component';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { EditVehiclesComponent } from './edit-vehicles/edit-vehicles.component';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';
import { EditStaffComponent } from './edit-staff/edit-staff.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  { path: 'resource', component: ResourceComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'booking/add', component: AddBookingComponent },
  { path: 'booking/edit/:id', component: BookingEditComponent },
  { path: 'resource/vehicles/add', component: AddVehiclesComponent },
  { path: 'resource/equipment/add', component: AddEquipmentComponent },
  {path: 'resource/staff/add', component: AddStaffComponent},
  {path: 'resource/edit-vehicles/:id', component: EditVehiclesComponent},

  { path: 'resource/staff/add', component: AddStaffComponent },

  { path: 'resource/edit-equipment/:id', component: EditEquipmentComponent },
  { path: 'resource/edit-staff/:id', component: EditStaffComponent },

];
