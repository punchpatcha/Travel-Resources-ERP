import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceService, Resource } from '../services/resource.service';
import { BookingService, Booking } from '../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // ตัวแปรสำหรับข้อมูล
  totalVehicle: number = 0;
  totalEquipment: number = 0;
  totalStaff: number = 0;
  lowStockVehicles: number = 0;
  lowStockEquipment: number = 0;
  lowStockStaff: number = 0;
  activePercentage: number = 0;

  selectedView: string = 'vehicles'; // มุมมองที่เลือก (vehicles/equipment)
  resources: Resource[] = [];
  bookings: Booking[] = [];
  combinedBookings: any[] = []; // อาร์เรย์สำหรับเก็บข้อมูลที่รวมกัน
  recentActivities: any[] = [];

  constructor(
    private resourceService: ResourceService,
    private bookingService: BookingService,
    private router: Router  
  ) {}

  ngOnInit(): void {
    this.loadResourcesAndBookings();
  }


  // ฟังก์ชันสำหรับนำทางไปยังหน้า booking detail
  goToBookingDetail(bookingId: string): void {
    this.router.navigate(['/booking/edit', bookingId]);  // ใช้ Router เพื่อไปที่ booking ID
  }

  // โหลดข้อมูล Resources และ Bookings พร้อมกัน
  loadResourcesAndBookings(): void {
    this.resourceService.getAllResources().subscribe(
      (resources: Resource[]) => {
        this.resources = resources;
  
        // คำนวณตัวเลขสถิติ (เช่น totalVehicle)
        this.calculateResourceStats();
  
        this.bookingService.getBookings().subscribe(
          (bookings: Booking[]) => {
            this.bookings = bookings;
  
            // รวมข้อมูลระหว่าง bookings และ resources
            this.combineBookingsWithResources();
  
            // ฟิลเตอร์ข้อมูลการจองสถานะ Pending (Upcoming Bookings)
            this.recentActivities = bookings
              .filter((booking) => booking.status === 'Pending') // เฉพาะสถานะ Pending
              .map((booking) => {
                // ดึง resourceId จาก booking (เช่นจาก details)
                let resourcesFromDetails = [];
                try {
                  resourcesFromDetails = JSON.parse(booking.details);
                } catch (error) {
                  console.error('Error parsing booking details:', error);
                }
  
                const resourceIdFromDetails = resourcesFromDetails[0]?._id;
  
                // ค้นหา resource ที่เกี่ยวข้อง
                const matchedResource = this.resources.find(
                  (resource) => resource._id === resourceIdFromDetails
                );
  
                return {
                  ...booking,
                  type: matchedResource?.type || 'Unknown', // เพิ่ม type
                  category: matchedResource?.category || 'Unknown', // เพิ่ม category
                };
              })
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) // เรียงตาม startDate
              .slice(0, 5); // แสดงแค่ 5 รายการแรก
          },
          (error) => {
            console.error('Error loading bookings:', error);
          }
        );
      },
      (error) => {
        console.error('Error loading resources:', error);
      }
    );
  }

  // ฟังก์ชันสำหรับรวมข้อมูล resources กับ bookings
  combineBookingsWithResources(): void {
    this.combinedBookings = this.bookings.map((booking) => {
      // แปลงข้อมูล details จากสตริงเป็นอาร์เรย์ของอ็อบเจ็กต์
      let resourcesFromDetails = [];
      try {
        resourcesFromDetails = JSON.parse(booking.details);
      } catch (error) {
        console.error('Error parsing details:', error);
      }
  
      // ตรวจสอบว่า details มีอาร์เรย์ของ Resource หรือไม่ และดึง _id จากอ็อบเจ็กต์แรก
      const resourceIdFromDetails = resourcesFromDetails[0]?._id;
  
      // ค้นหาข้อมูล Resource โดยใช้ _id จาก details
      const matchedResource = this.resources.find(
        (resource) => resource._id === resourceIdFromDetails
      );
  
      return {
        ...booking,
        type: matchedResource?.type || 'Unknown', // ใช้ข้อมูลจาก matchedResource หรือ 'Unknown'
        category: matchedResource?.category || 'Unknown', // ใช้ข้อมูลจาก matchedResource หรือ 'Unknown'
      };
    });
  
    console.log('Combined Bookings:', this.combinedBookings);
  }

  // ฟังก์ชันคำนวณตัวเลขสถิติ
  calculateResourceStats(): void {
    this.totalVehicle = this.resources.filter((res) => res.type === 'Vehicles').length;
    this.totalEquipment = this.resources.filter((res) => res.type === 'Equipment').length;
    this.totalStaff = this.resources.filter((res) => res.type === 'Staff').length;

    this.lowStockVehicles = this.resources.filter(
      (res) => res.type === 'Vehicles' && res.status === 'Available'
    ).length;

    this.lowStockEquipment = this.resources.filter(
      (res) => res.type === 'Equipment' && res.status === 'Available'
    ).length;

    this.lowStockStaff = this.resources.filter(
      (res) => res.type === 'Staff' && res.status === 'Available'
    ).length;

    const totalResources = this.totalVehicle + this.totalEquipment + this.totalStaff;
    const usedResources = this.lowStockVehicles + this.lowStockEquipment + this.lowStockStaff;

    this.activePercentage = totalResources > 0 ? Math.round((usedResources / totalResources) * 100) : 0;
  }
}
