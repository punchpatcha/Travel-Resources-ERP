import { Routes } from '@angular/router';
import { ResourceComponent } from './resource/resource.component';
import { BookingComponent } from './booking/booking.component';
import { AddBookingComponent } from './add-booking/add-booking.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'resource', pathMatch: 'full' }, // ตั้งหน้าเริ่มต้นเป็น Resource
  { path: 'resource', component: ResourceComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'addBooking', component: AddBookingComponent },
];
