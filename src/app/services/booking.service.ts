//src\app\services\booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  bookingId: string;
  customerName: string;
  details: string;
  startDate: string;
  endDate: string;
  status: string;
  resourceId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api/bookings'; // เปลี่ยน URL ตาม backend ของคุณ

  constructor(private http: HttpClient) {}

  // GET: ดึงข้อมูลการจองทั้งหมด
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // POST: สร้างการจองใหม่
  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // GET: ดึงข้อมูลการจองตาม ID
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  // PUT: แก้ไขการจอง
  updateBooking(id: string, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  // DELETE: ลบการจอง
  deleteBooking(bookingId: string) {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }
  
  
}
