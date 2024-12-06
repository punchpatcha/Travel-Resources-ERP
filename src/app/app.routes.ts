import { Routes } from '@angular/router';
import { ResourceComponent } from './resource/resource.component';
import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';
import { AddVehiclesComponent } from './add-vehicles/add-vehicles.component';
import { AddEquipmentComponent } from './add-equipment/add-equipment.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { EditEquipmentComponent } from './edit-equipment/edit-equipment.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'resource', component: ResourceComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'booking/add', component: AddBookingComponent },
  { path: 'booking/edit/:id', component: BookingEditComponent },
  { path: 'resource/vehicles/add', component: AddVehiclesComponent },
  { path: 'resource/equipment/add', component: AddEquipmentComponent },
  { path: 'resource/staff/add', component: AddStaffComponent },

  { path: 'resource/edit-equipment/:id', component: EditEquipmentComponent },
  // ใส่หน้า edit ต่อตรงนี้
  // { path: 'resource/edit-vehicles/:id', component: EditVehiclesComponent },
  // { path: 'resource/edit-staff/:id', component: EditStaffComponent },

];
