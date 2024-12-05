
import { Component, OnInit } from '@angular/core';
import { ResourceService, Resource } from '../services/resource.service';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports:[CommonModule, FormsModule],
selector: 'app-resource',
templateUrl: './resource.component.html',
styleUrls: ['./resource.component.css']
})
export class ResourceComponent implements OnInit {
  searchTerm: string = ''; // คำค้นหา
  selectedView: string = 'vehicles'; // ประเภทเริ่มต้น
  resources: Resource[] = []; // รายการข้อมูลทั้งหมด
  filteredResources: Resource[] = []; // รายการข้อมูลที่ถูกกรอง
  constructor(private resourceService: ResourceService, private router: Router) {}
  // รายการข้อมูล (Mock Data)
  ngOnInit(): void {
    this.loadResources(); // เรียกข้อมูลเมื่อ component ถูกสร้าง
  }

   // ฟังก์ชันโหลดข้อมูลจาก Service
   loadResources(): void {
    this.resourceService.getAllResources().subscribe(
      (data) => {
        this.resources = data; // เก็บข้อมูลทั้งหมด
        this.applyFilters(); // เรียกฟังก์ชันเพื่อกรองข้อมูล
      },
      (error) => console.error('Error loading resources:', error)
    );
  }

  // ใช้กำหนดคลาสสำหรับสถานะ
   // ฟังก์ชันกรองข้อมูล
   applyFilters(): void {
    this.filteredResources = this.resources
      .filter((item) => {
        // กรองตามประเภทที่เลือก
        if (this.selectedView === 'vehicles') return item.type === 'Vehicles';
        if (this.selectedView === 'equipment') return item.type === 'Equipment';
        if (this.selectedView === 'staff') return item.type === 'Staff';
        return false;
      })
  }
  // เปลี่ยนประเภทข้อมูล (View)
  changeView(view: string): void {
    this.selectedView = view; // ตั้งค่าประเภทที่เลือก
    this.applyFilters(); // กรองข้อมูลใหม่
  }
  // นำทางไปยังหน้าเพิ่ม Resource
  navigateToAddResource(): void {
    this.router.navigate([`resource/${this.selectedView}/add`]); // ตัวอย่าง URL: /vehicles/add
  }
  // แสดงคลาสสำหรับสถานะ
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
    case 'available': return 'status available';
    case 'booked': return 'status booked';
    case 'in use': return 'status in-use';
    case 'maintenance': return 'status maintenance';
    case 'unavailable': return 'status unavailable';
    default: return '';
  }
}
  // ฟังก์ชันสำหรับการแก้ไข Resource
  editResource(resourceId: number): void {
    this.router.navigate([`/${this.selectedView}/edit`, resourceId]);
  }
}