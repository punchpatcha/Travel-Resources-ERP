import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceService, Resource } from '../services/resource.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute, // เพิ่มเข้าไป
    private resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectedView = params['type'];
      } else {
        this.selectedView = 'vehicles'; // ตั้งค่าเริ่มต้น
      }
    });
  
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
          return !('plateNumber' in item) && !('role' in item);
        } else {
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
      case 'maintenance':
        return 'status canceled';
      case 'booked':
        return 'status booked';
      case 'unavailable': //staff
        return 'status unavailable';
      default:
        return '';
    }
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: this.selectedView },
      queryParamsHandling: 'merge', // รวม queryParams เดิม
    });
  }

  
  // สำหรับ edit แต่ละประเภท
  navigateToAddResource() {
    this.router.navigate([`resource/${this.selectedView}/add`], {
      queryParams: { type: this.selectedView },
    });
  }
  
  navigateToEditResource(resourceId: string) {
    const editPath = `resource/edit-${this.selectedView}/${resourceId}`; // สร้างเส้นทางตามประเภทที่เลือก
    this.router.navigate([editPath], {
      queryParams: { type: this.selectedView }, // ส่งประเภทใน queryParams
    });
  }
  
  
  }
