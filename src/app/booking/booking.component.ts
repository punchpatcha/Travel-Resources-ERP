import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  bookings: any[] = [];

  constructor(private http: HttpClient) {
    this.fetchBookings();
  }

  fetchBookings() {
    this.http.get<any[]>('http://localhost:3000/api/bookings')
      .subscribe((data) => {
        this.bookings = data; // ตั้งค่าข้อมูลที่ดึงมาให้กับ bookings
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Booked':
        return 'status-booked';
      case 'In Use':
        return 'status-in-use';
      case 'Returned':
        return 'status-returned';
      case 'Canceled':
        return 'status-canceled';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }
}
