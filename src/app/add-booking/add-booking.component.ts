import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService, Booking } from '../services/booking.service';
import { ResourceService, Resource } from '../services/resource.service';

@Component({
  selector: 'app-add-booking',
  standalone: true,
  templateUrl: './add-booking.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent implements OnInit {
  // ข้อมูลการจองที่ใช้งานในฟอร์ม
  bookingData: Booking = {
    bookingId: '',
    customerName: '',
    details: '',
    startDate: '',
    endDate: '',
    status: 'Pending',
  };

  // รายการสถานะการจอง
  statuses = ['Pending', 'Booked', 'In Use', 'Returned'];

  // รายการประเภททรัพยากรที่มีให้เลือก
  categories = ['Vehicles', 'Equipment', 'Staff'];
  currentCategory = 'Vehicles';
  isDropdownOpen = false;

  // ชื่อหัวตารางและฟิลด์ที่แสดงในแต่ละประเภท
  tableHeaders: string[] = [];
  tableFields: string[] = [];
  currentItems: any[] = [];

  // การเปิดปิด modal
  isModalOpen = false;
  selectedDetails: string[] = [];
  selectedChecklist: { name: string; category: string; quantity: number }[] = [];

  constructor(
    private location: Location,
    private bookingService: BookingService,
    private resourceService: ResourceService,
    private router: Router
  ) {}

  // ฟังก์ชันที่เรียกเมื่อคอมโพเนนต์เริ่มต้น
  ngOnInit() {
    this.updateTable();
  }

  // ฟังก์ชันเปิด modal เพื่อเลือกข้อมูล
  openDetailsModal() {
    this.isModalOpen = true;
    this.loadItems(this.currentCategory);
    console.log('Modal opened. Current category:', this.currentCategory);
  }

  // ฟังก์ชันปิด modal
  closeModal() {
    this.isModalOpen = false;
  }

  // ฟังก์ชันบันทึกข้อมูลการเลือกใน checklist ไปยัง bookingData
  saveSelection() {
    console.log('Selected Checklist:', this.selectedChecklist);
    this.bookingData.details = this.selectedChecklist.map(item => item.category).join(', ');
    this.closeModal();
  }

  // ฟังก์ชันบันทึกข้อมูลการจอง
  saveBooking() {
    // สร้าง bookingId โดยใช้วัน เดือน ปี และเวลาปัจจุบันในการสร้าง ID
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
  
    // สร้าง bookingId ในรูปแบบ BK-DDMMYYHHMMSS
    this.bookingData.bookingId = `BK-${day}${month}${year}${hours}${minutes}${seconds}`;
  
    // เรียกใช้ service เพื่อบันทึกข้อมูลการจองใน MongoDB
    this.bookingService.addBooking(this.bookingData).subscribe(
      (response) => {
        console.log('Booking saved successfully:', response);
        this.router.navigate(['/booking']);
      },
      (error) => {
        console.error('Error saving booking:', error);
      }
    );
  }
  

  // ฟังก์ชัน toggle เพื่อเปิดปิด dropdown เลือกประเภทใน modal
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Modal opened. Current category:', this.currentCategory);
  }

  // ฟังก์ชันเลือกประเภทและโหลดข้อมูลที่เกี่ยวข้องมาแสดง
  selectCategory(category: string) {
    this.loadItems(this.currentCategory);
    this.currentCategory = category;
    this.isDropdownOpen = false;
    this.updateTable();
  }

  // ฟังก์ชันเปลี่ยนประเภทและโหลดข้อมูลใหม่
  changeCategory(event: any) {
    this.loadItems(this.currentCategory);
    this.currentCategory = event.target.value;
    this.updateTable();
  }

  // ฟังก์ชันโหลดข้อมูลทรัพยากรที่ว่างอยู่ตามประเภทที่เลือก
  loadItems(category: string) {
    this.resourceService.getAvailableResources().subscribe(
      (data) => {
        console.log('All data loaded:', data);
        this.currentItems = data.filter(
          (item) =>
            item.type.toLowerCase() === this.currentCategory.toLowerCase() &&
            item.status === 'Available'
        );
        console.log('Filtered data loaded:', this.currentItems);
        this.updateTable();
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  // ฟังก์ชันอัปเดตหัวตารางและฟิลด์ตามประเภทที่เลือก
  updateTable() {
    if (this.currentCategory === 'Vehicles') {
      this.tableHeaders = [
        'Name', 'Category', 'Capacity', 'Status', 'Plate Number', 'Last Used',
      ];
      this.tableFields = [
        'name', 'category', 'capacity', 'status', 'plateNumber', 'lastUsed',
      ];
    } else if (this.currentCategory === 'Equipment') {
      this.tableHeaders = [
        'Name', 'Category', 'Available Units', 'Total Units', 'Status', 'Last Used',
      ];
      this.tableFields = [
        'name', 'category', 'availableUnits', 'totalUnits', 'status', 'lastUsed',
      ];
    } else if (this.currentCategory === 'Staff') {
      this.tableHeaders = [
        'Name', 'Role', 'Contact', 'Status', 'Last Assignment',
      ];
      this.tableFields = [
        'name', 'role', 'contact', 'status', 'lastAssignment',
      ];
    }
  }

  // ฟังก์ชันตรวจสอบการเลือก item ใน checklist
  toggleSelection(item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedDetails.includes(item.category)) {
        this.selectedDetails.push(item.category);
        this.selectedChecklist.push({ category: item.category, name: item.name, quantity: 1 });
      }
    } else {
      this.selectedDetails = this.selectedDetails.filter(
        (detail) => detail !== item.category
      );
      this.selectedChecklist = this.selectedChecklist.filter(
        (checklistItem) => checklistItem.category !== item.category
      );
    }
  }

  // ฟังก์ชันย้อนกลับไปยังหน้าก่อนหน้า
  goBack(): void {
    this.location.back();
  }

  // ฟังก์ชันตรวจสอบว่า item ถูกเลือกหรือไม่
  isSelected(item: any): boolean {
    return this.selectedDetails.includes(item.name);
  }
}
