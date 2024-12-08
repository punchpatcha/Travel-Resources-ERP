import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-report',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  selectedMonth: string = ''; // Default: All Months
  selectedYear: string = ''; // Default: All Years
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = []; // Will be populated dynamically

  constructor(private http: HttpClient) {
    this.populateYears(); // Generate year options
    this.fetchBookings();
  }

  populateYears() {
    // หา startDate ที่เก่าที่สุดจากข้อมูล bookings
    const minYear = Math.min(
      ...this.bookings.map((booking) =>
        booking.startDate ? new Date(booking.startDate).getFullYear() : new Date().getFullYear()
      )
    );
  
    // สร้างช่วงปีย้อนหลังสูงสุด 5 ปี หรือเริ่มจากปีที่เก่าที่สุด
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(minYear, currentYear - 5); // ไม่เกิน 5 ปีย้อนหลัง
  
    this.years = [];
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  fetchBookings() {
    this.http.get<any[]>('http://localhost:3000/api/bookings')
      .subscribe((data) => {
        this.bookings = data.map((booking) => {
          const parsedDetails = JSON.parse(booking.details || '[]');
          const combinedDetails = Array.from(new Set(parsedDetails.flatMap((item: any) => {
            const details = [];
            if (item.category) details.push(item.category);
            if (item.role) details.push(item.role);
            return details;
          })));
          return { ...booking, details: combinedDetails.join(', ') };
        });
  
        this.populateYears(); // สร้างช่วงปีหลังจากโหลด bookings
        this.filterBookings(); // ใช้ตัวกรองครั้งแรก
      });
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter((booking) => {
      if (booking.status !== 'Returned') return false;

      const startDate = booking.startDate ? new Date(booking.startDate) : null;
      if (!startDate) return false;

      const bookingMonth = startDate.getMonth() + 1; // Months are 0-based
      const bookingYear = startDate.getFullYear();

      const matchesMonth =
        this.selectedMonth ? bookingMonth === +this.selectedMonth : true;
      const matchesYear =
        this.selectedYear ? bookingYear === +this.selectedYear : true;

      return matchesMonth && matchesYear;
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
