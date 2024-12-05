import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceService, Resource } from '../services/resource.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css'],
})
export class ResourceComponent implements OnInit {
  searchTerm: string = ''; // สำหรับช่องค้นหา
  selectedView: string = 'vehicles'; // มุมมองที่เลือก (vehicles/equipment)
  resources: Resource[] = []; // ตัวแปรสำหรับเก็บข้อมูลจาก MongoDB

  constructor(private router: Router, private resourceService: ResourceService) {}

  ngOnInit(): void {
    // เรียกใช้เมธอดเพื่อดึงข้อมูลจาก API เมื่อ component ถูกโหลด
    this.loadResources();
  }

  // โหลดข้อมูลจาก API
  loadResources(): void {
    this.resourceService.getAllResources().subscribe(
      (data: Resource[]) => {
        this.resources = data;
      },
      (error) => {
        console.error('Error loading resources:', error);
      }
    );
  }


  // กรองรายการตามประเภทที่เลือก (vehicles หรือ equipment)
  filteredResources() {
    return this.resources
      .filter((item) => {
        if (this.selectedView === 'vehicles') {
          return 'plateNumber' in item; // ตรวจสอบว่าเป็น vehicle หรือไม่
        } else if (this.selectedView === 'equipment') {
          return 'totalUnits' in item; // ตรวจสอบว่าเป็น equipment หรือไม่
        } else{
          return 'role' in item; 
        }
  
      })
      .filter(
        (item) =>
          // เพิ่มการกรองข้อมูลด้วย searchTerm
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  getStatusList(status: string): string[] {
    // สมมติว่าถ้ามีหลาย status จะคั่นด้วย ","
    return status.split(',').map((s) => s.trim());
  }


  // ใช้กำหนดคลาสสำหรับสถานะ
  getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'available':
        return 'status available';
      case 'under maintenance':
        return 'status canceled';
      case 'booked':
        return 'status booked';
      case 'unavailable': //staff
        return 'status unavailable';
      default:
        return '';
    }
  }
  navigateToAddResource() {
    if (this.selectedView === 'vehicles') {
      this.router.navigate(['resource/vehicles/add']);
    } else if (this.selectedView === 'equipment') {
      this.router.navigate(['resource/equipment/add']);
    } else if (this.selectedView == 'staff') {
      this.router.navigate(['resource/staff/add']);
    }
  }
}
