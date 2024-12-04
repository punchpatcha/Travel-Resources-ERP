import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService, Booking } from '../services/booking.service';
import { ResourceService, Resource } from '../services/resource.service';

@Component({
  selector: 'app-booking-edit',
  standalone: true,
  templateUrl: './booking-edit.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./booking-edit.component.css'],
})
export class BookingEditComponent implements OnInit {
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
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private resourceService: ResourceService,
    private location: Location,
    private router: Router
  ) {}

  isItemChecked(item: any): boolean {
    return this.selectedChecklist.some((check) => check._id === item._id);
  }

  ngOnInit() {
    // โหลดข้อมูล booking ที่เลือก
    const bookingId = this.route.snapshot.paramMap.get('id') || '';
    this.bookingService.getBookingById(bookingId).subscribe(
      (booking) => {
        this.bookingData = booking;
        this.selectedChecklist = JSON.parse(booking.details || '[]'); // แปลง details กลับมาเป็น Array
        this.loadItems(this.currentCategory); // โหลดรายการ Resource ตาม category ปัจจุบัน
      },
      (error) => console.error('Error loading booking:', error)
    );
    if (bookingId) {
      this.loadBooking(bookingId);
    }
    this.updateTable();
  }

  // Helper function สำหรับแปลงวันที่
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // คืนค่าในรูปแบบ yyyy-MM-dd
  }

  loadBooking(bookingId: string) {
    this.bookingService.getBookingById(bookingId).subscribe(
      (data) => {
        this.bookingData = data;
        this.selectedChecklist = JSON.parse(this.bookingData.details) || [];
        this.selectedDetails = this.selectedChecklist.map(
          (item) => item.category
        );
      },
      (error) => {
        console.error('Error loading booking:', error);
      }
    );
  }

  openDetailsModal() {
    this.isModalOpen = true;
    this.loadItems(this.currentCategory);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // ปุ่ม save บันทึก resource ที่เลือกใน Modal
  saveSelection() {
    this.bookingData.details = JSON.stringify(this.selectedChecklist);
  
    // อัปเดตสถานะของ resource ที่ถูกลบให้อยู่ในสถานะ 'Available'
    const currentResourceIds = this.selectedChecklist.map((item) => item._id);
    this.currentItems.forEach((item) => {
      if (!currentResourceIds.includes(item._id)) {
        // เพียงแค่เปลี่ยนสถานะเป็น 'Available' โดยไม่ปรับปรุง availableUnits ที่นี่
        this.resourceService
          .updateResource(item._id, { status: 'Available' })
          .subscribe(
            () => {
              console.log(`Resource ${item._id} status updated to Available`);
            },
            (error) => {
              console.error('Error updating resource status:', error);
            }
          );
      }
    });
  
    // Update the displayed resources to reflect the current selection
    this.loadItems(this.currentCategory);
    this.closeModal();
  }
  

  saveBooking() {
    this.isLoading = true;
    // ตรวจสอบฟิลด์ที่จำเป็น
    if (
      !this.bookingData.customerName ||
      !this.bookingData.startDate ||
      !this.bookingData.endDate
    ) {
      console.error('Please provide all required fields');
      this.isLoading = false; // ปิด loading เมื่อข้อมูลไม่ครบ
      return;
    }
  
    // แปลงวันที่ให้อยู่ในรูปแบบ ISO 8601 ก่อนส่งไปยัง API
    this.bookingData.startDate = new Date(
      this.bookingData.startDate
    ).toISOString();
    this.bookingData.endDate = new Date(this.bookingData.endDate).toISOString();
  
    // อัปเดตข้อมูล booking (ไม่ต้องอัปเดตสถานะของทรัพยากรที่นี่)
    this.bookingService
      .updateBooking(this.bookingData.bookingId, this.bookingData)
      .subscribe(
        (response) => {
          console.log('Booking updated successfully:', response);
          this.isLoading = false;
          this.router.navigate(['/booking']);
        },
        (error) => {
          console.error('Error updating booking:', error);
          this.isLoading = false;
        }
      );
  }
  
  // ปุ่มลบ
  deleteBooking() {
    this.isLoading = true;
    console.log('Deleting booking with ID:', this.bookingData.bookingId);
  
    this.bookingService.deleteBooking(this.bookingData.bookingId).subscribe(
      (response) => {
        console.log('Booking deleted successfully:', response);
        this.isLoading = false;
        this.router.navigate(['/booking']);
      },
      (error) => {
        console.error('Error deleting booking:', {
          errorResponse: error,
          bookingId: this.bookingData.bookingId,
        });
        this.isLoading = false;
      }
    );
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(category: string) {
    this.currentCategory = category;
    this.isDropdownOpen = false;
    this.loadItems(category);
    this.updateTable();
  }

  loadItems(category: string) {
    this.resourceService.getAllResources().subscribe(
      (data) => {
        this.currentItems = data.filter(
          (item) =>
            item.type.toLowerCase() === category.toLowerCase() &&
            (item.status === 'Available' ||
              this.selectedChecklist.some((check) => check._id === item._id))
        );
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  toggleSelection(item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const existingItem = this.selectedChecklist.find(
      (check) => check._id === item._id
    );

    if (isChecked) {
      if (!existingItem) {
        this.selectedChecklist.push({
          _id: item._id,
          name: item.name,
          category: item.type,
          quantity: 1,
        });
      } else {
        existingItem.quantity++;
      }
    } else {
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
      } else {
        this.selectedChecklist = this.selectedChecklist.filter(
          (check) => check._id !== item._id
        );
      }
    }

    // Update the details array for display purposes
    this.selectedDetails = this.selectedChecklist.map((item) => item.category);
    this.bookingData.details = JSON.stringify(this.selectedChecklist);
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

  goBack() {
    this.router.navigate(['/booking']);
  }
}
