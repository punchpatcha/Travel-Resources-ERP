import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports:[CommonModule, FormsModule],
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent {
  constructor(private router: Router) {}
  // ตัวแปรสำหรับผูกข้อมูลกับ UI
  searchTerm: string = ''; // สำหรับช่องค้นหา
  selectedView: string = 'vehicles'; // มุมมองที่เลือก (vehicles/equipment)

  // รายการข้อมูล (Mock Data)
  resources = [
    // Vehicle Data
    {
      name: 'Van',
      category: 'Passenger',
      plateNumber: 'ABC-1234',
      capacity: 15,
      status: 'Available',
      lastUsed: '2023-11-20'
    },
    {
      name: 'Truck',
      category: 'Cargo',
      plateNumber: 'DEF-5678',
      capacity: 10,
      status: 'In Use',
      lastUsed: '2023-11-22'
    },

    // Equipment Data
    {
      name: 'Forklift',
      category: 'Heavy Equipment',
      availableUnits: 3,
      totalUnits: 5,
      status: 'Available',
      lastUsed: '2023-11-19'
    },
    {
      name: 'Drill',
      category: 'Tool',
      availableUnits: 10,
      totalUnits: 20,
      status: 'Under Maintenance',
      lastUsed: '2023-11-18'
    }
  ];

  // กรองรายการตามประเภทที่เลือก (vehicles หรือ equipment)
  filteredResources() {
    return this.resources.filter(item => {
      if (this.selectedView === 'vehicles') {
        return 'plateNumber' in item; // ตรวจสอบว่าเป็น vehicle หรือไม่
      } else if (this.selectedView === 'equipment') {
        return 'totalUnits' in item; // ตรวจสอบว่าเป็น equipment หรือไม่
      }
      return false;
    }).filter(item => 
      // เพิ่มการกรองข้อมูลด้วย searchTerm
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ใช้กำหนดคลาสสำหรับสถานะ
  getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'available':
        return 'status available';
      case 'in use':
        return 'status booked';
      case 'under maintenance':
        return 'status pending';
      case 'out of service':
        return 'status canceled';
      default:
        return '';
    }
  }
  navigateToAddResource() {
    if (this.selectedView === 'vehicles') {
      this.router.navigate(['/vehicles/add']);
    } else if (this.selectedView === 'equipment') {
      this.router.navigate(['/equipment/add']); 
    }
  }
  
}
