import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Booking {
  bookingId: string;
  customerName: string;
  details: string;
  startDate: string;
  endDate: string;
  status: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  imports: [CommonModule, RouterModule], // นำเข้า CommonModule
  styleUrls: ['./booking.component.css']

})
export class BookingComponent {  
  
// Mock data สำหรับแสดงใน UI
bookings = [
  { bookingId: 'BK-001', customerName: 'John Smith', details: 'Car, Camera', startDate: '25/07/2021', endDate: '25/08/2021', status: 'Returned' },
  { bookingId: 'BK-002', customerName: 'Mary Jones', details: 'Car, Camera', startDate: '10/08/2021', endDate: '11/08/2021', status: 'Booked' },
  { bookingId: 'BK-003', customerName: 'Alex Brown', details: 'Car, Staff', startDate: '10/08/2021', endDate: '15/08/2021', status: 'In Use' },
  { bookingId: 'BK-003', customerName: 'Alex Brown', details: 'Car, Staff', startDate: '10/08/2021', endDate: '15/08/2021', status: 'Pending' },
  { bookingId: 'BK-003', customerName: 'Alex Brown', details: 'Car, Staff', startDate: '10/08/2021', endDate: '15/08/2021', status: 'Canceled' },

];

// constructor(private bookingService: BookingService) {}

// ngOnInit() {
//   this.loadBookings(); // เรียกฟังก์ชันเพื่อดึงข้อมูล booking เมื่อคอมโพเนนต์เริ่มทำงาน
// }

// loadBookings() {
//   this.bookingService.getBookings().subscribe((data: any) => {
//     this.bookings = data;
//     console.log('Bookings:', this.bookings); // ตรวจสอบข้อมูลที่ได้จาก API
//   });
// }

addBooking() {
  console.log('Add booking clicked!');
  // ตัวอย่างการเปิด modal หรือเรียกฟอร์มเพื่อเพิ่มการจองใหม่
  // คุณสามารถแทนที่ด้วยการเปิดฟอร์มหรือการสร้าง Booking ใหม่
}

newBooking() {
  console.log('Creating a new booking...');
  // เพิ่มฟังก์ชันนี้ถ้าต้องการสร้างการจองใหม่จากฟอร์ม
}

editBooking(booking: Booking) {
  console.log('Edit booking: ', booking);
  // เพิ่มฟังก์ชันนี้เพื่อแก้ไขการจองตาม ID
}

getStatusClass(status: string): string {
  return status.toLowerCase().replace(/\s+/g, '-'); // แปลงเว้นวรรคเป็นขีดกลาง
}

}
