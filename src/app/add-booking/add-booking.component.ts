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
  bookingData: Booking = {
    bookingId: '',
    customerName: '',
    details: '',
    startDate: '',
    endDate: '',
    status: 'Pending',
  };

  statuses = ['Pending', 'Booked', 'In Use', 'Returned'];

  categories = ['Vehicles', 'Equipment', 'Staff'];
  currentCategory = 'Vehicles';
  isDropdownOpen = false;

  tableHeaders: string[] = [];
  tableFields: string[] = [];
  currentItems: any[] = [];

  isModalOpen = false;
  selectedDetails: string[] = [];
selectedChecklist: { name: string; category: string; quantity: number }[] = [];

  constructor(
    private location: Location,
    private bookingService: BookingService,
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateTable();
    
  }

  openDetailsModal() {
    this.isModalOpen = true;
    this.loadItems(this.currentCategory);
    console.log('Modal opened. Current category:', this.currentCategory);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveSelection() {
    console.log('Selected Checklist:', this.selectedChecklist);
  
    // รวมข้อมูลที่เลือกใน checklist ไปยัง bookingData
    this.bookingData.details = this.selectedChecklist.map(item => item.category).join(', ');
    this.closeModal();
  }
  

  saveBooking() {
    // สร้าง bookingId โดยใช้วัน เดือน ปี ในการสร้าง ID
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0
    const year = String(today.getFullYear()).slice(-2); // ดึงปีสุดท้าย 2 หลัก
  
    this.bookingData.bookingId = `BK-${day}/${month}/${year}`;
  
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
  
        
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Modal opened. Current category:', this.currentCategory);
  }

  selectCategory(category: string) {
    this.loadItems(this.currentCategory);
    this.currentCategory = category;
    this.isDropdownOpen = false;
    this.updateTable();
  }

  changeCategory(event: any) {
    this.loadItems(this.currentCategory);
    this.currentCategory = event.target.value;
    this.updateTable();
  }

  loadItems(category: string) {
    this.resourceService.getAvailableResources().subscribe(
      (data) => {
        console.log('All data loaded:', data); // ตรวจสอบข้อมูลทั้งหมดที่โหลดมา
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

  updateTable() {
    // Update table headers and fields based on currentCategory
    if (this.currentCategory === 'Vehicles') {
      this.tableHeaders = [
        'Name',
        'Category',
        'Capacity',
        'Status',
        'Plate Number',
        'Last Used',
      ];
      this.tableFields = [
        'name',
        'category',
        'capacity',
        'status',
        'plateNumber',
        'lastUsed',
      ];
    } else if (this.currentCategory === 'Equipment') {
      this.tableHeaders = [
        'Name',
        'Category',
        'Available Units',
        'Total Units',
        'Status',
        'Last Used',
      ];
      this.tableFields = [
        'name',
        'category',
        'availableUnits',
        'totalUnits',
        'status',
        'lastUsed',
      ];
    } else if (this.currentCategory === 'Staff') {
      this.tableHeaders = [
        'Name',
        'Role',
        'Contact',
        'Status',
        'Last Assignment',
      ];
      this.tableFields = [
        'name',
        'role',
        'contact',
        'status',
        'lastAssignment',
      ];
    }
  }

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

  goBack(): void {
    this.location.back();
  }

  isSelected(item: any): boolean {
    return this.selectedDetails.includes(item.name);
  }
}
