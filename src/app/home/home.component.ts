import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceService, Resource } from '../services/resource.service';
import { BookingService, Booking } from '../services/booking.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // ตัวแปรสำหรับข้อมูล
  totalVehicle: number = 0; // จำนวน vehicles ทั้งหมด
  totalEquipment: number = 0; // จำนวน equipment ทั้งหมด
  totalStaff: number = 0; // จำนวน staff ทั้งหมด
  lowStockVehicles: number = 0; // จำนวน vehicle ที่มีในสต็อก
  lowStockEquipment: number = 0; // จำนวน equipment ที่มีในสต็อก
  lowStockStaff: number = 0; // จำนวน staff ที่มีในสต็อก
  activePercentage: number = 0; // เปอร์เซ็นต์ของทรัพยากรที่ใช้งาน

  selectedView: string = 'vehicles'; // มุมมองที่เลือก (vehicles/equipment)
  resources: Resource[] = []; // ตัวแปรสำหรับเก็บข้อมูลจาก MongoDB

  bookings: Booking[] = [];
  recentActivities: any[] = [];

  constructor(
    private resourceService: ResourceService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getAllResources().subscribe(
      (data: Resource[]) => {
        this.resources = data;

        // นับจำนวนของแต่ละประเภท (Vehicle, Equipment, Staff)
        this.totalVehicle = this.resources.filter((res) => res.type === 'Vehicles').length;
        this.totalEquipment = this.resources.filter((res) => res.type === 'Equipment').length;
        this.totalStaff = this.resources.filter((res) => res.type === 'Staff').length;

        // ตรวจสอบจำนวนที่มีในสต็อก (อาจจะเป็น 'Available' หรือตามที่ต้องการ)
        this.lowStockVehicles = this.resources.filter(
          (res) => res.type === 'Vehicles' && res.status === 'Available'
        ).length;

        this.lowStockEquipment = this.resources.filter(
          (res) => res.type === 'Equipment' && res.status === 'Available'
        ).length;

        this.lowStockStaff = this.resources.filter(
          (res) => res.type === 'Staff' && res.status === 'Available'
        ).length;

        // คำนวณเปอร์เซ็นต์การใช้งาน (สมมติว่า resources ทั้งหมดคือ total)
        const totalResources = this.totalVehicle + this.totalEquipment + this.totalStaff;
        const usedResources = this.lowStockVehicles + this.lowStockEquipment + this.lowStockStaff;

        // คำนวณ active percentage
        if (totalResources > 0) {
          this.activePercentage = Math.round((usedResources / totalResources) * 100);
        } else {
          this.activePercentage = 0;
        }
      },
      (error) => {
        console.error('Error loading resources:', error);
      }
    );
  }
}
