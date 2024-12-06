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
        // Map data to include categories and roles from details
        this.bookings = data.map(booking => {
          const parsedDetails = JSON.parse(booking.details || '[]'); // แปลง JSON String กลับเป็น Array
          
          // ดึงทั้ง category และ role แล้วรวมเป็นข้อความเดียว
          const combinedDetails = Array.from(new Set(parsedDetails.flatMap((item: any) => {
            const details = [];
            if (item.category) details.push(item.category); // เพิ่ม category ถ้ามี
            if (item.role) details.push(item.role); // เพิ่ม role ถ้ามี
            return details;
          })));
          
          return { ...booking, details: combinedDetails.join(', ') }; // เก็บข้อมูลรวมเป็น String
        });
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
