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
  isLoading = false;
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
  selectedChecklist: {
    _id: string;
    name: string;
    category: string;
    quantity: number;
  }[] = [];

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
    this.bookingData.details = this.selectedChecklist
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ');
    this.closeModal();
  }

  saveBooking() {
    this.isLoading = true;
    const today = new Date();
    const bookingId = `BK-${today.getDate()}${
      today.getMonth() + 1
    }${today.getFullYear()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
    this.bookingData.bookingId = bookingId;
    this.bookingData.details = JSON.stringify(this.selectedChecklist);

    this.bookingService.addBooking(this.bookingData).subscribe(
      (response) => {
        console.log('Booking saved successfully:', response);
        this.isLoading = false;
        this.router.navigate(['/booking']);
      },
      (error) => {
        console.error('Error saving booking:', error);
        this.isLoading = false;
      }
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown toggled. Current category:', this.currentCategory);
  }

  selectCategory(category: string) {
    this.currentCategory = category;
    this.isDropdownOpen = false;
    this.loadItems(category);
    this.updateTable();
  }

  changeCategory(event: any) {
    this.currentCategory = event.target.value;
    this.loadItems(this.currentCategory);
    this.updateTable();
  }

  loadItems(category: string) {
    this.resourceService.getAvailableResources().subscribe(
      (data) => {
        this.currentItems = data.filter(
          (item) =>
            item.type.toLowerCase() === this.currentCategory.toLowerCase() &&
            item.status === 'Available'
        );

        // ตรวจสอบและทำให้สถานะ checkbox ตรงกับ selectedChecklist
        this.currentItems.forEach((item) => {
          item.isSelected = this.selectedChecklist.some(
            (check) => check._id === item._id
          );
        });

        console.log('Filtered data loaded:', this.currentItems);
        this.updateTable();
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  updateTable() {
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
      this.tableHeaders = ['Name', 'Category', 'Status', 'Last Used'];
      this.tableFields = ['name', 'category', 'status', 'lastUsed'];
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
      if (!this.selectedChecklist.some((check) => check._id === item._id)) {
        this.selectedChecklist.push({
          _id: item._id,
          name: item.name,
          category: item.category,
          quantity: 1, // ค่าเริ่มต้นของจำนวน
        });
      }
    } else {
      this.selectedChecklist = this.selectedChecklist.filter(
        (check) => check._id !== item._id
      );
    }

    // อัปเดต selectedDetails เพื่อแสดง category ที่เลือกทั้งหมด
    this.updateSelectedDetails();
  }

  // ฟังก์ชันช่วยในการอัพเดท selectedDetails จาก selectedChecklist
  updateSelectedDetails() {
    const categories = new Set<string>();
    this.selectedChecklist.forEach((item) => {
      categories.add(item.category);
    });
    this.selectedDetails = Array.from(categories);
  }

  goBack(): void {
    this.location.back();
  }

  isSelected(item: any): boolean {
    return this.selectedChecklist.some((check) => check._id === item._id);
  }
}
