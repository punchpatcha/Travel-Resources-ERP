import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-booking',
  standalone: true,
  templateUrl: './add-booking.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent {
  bookingData = {
    customerName: '',
    startDate: '',
    endDate: '',
    status: '',
  };

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back(); // นำทางกลับไปยังหน้าก่อนหน้า
  }
  statuses = ['Pending', 'Booked', 'In Use', 'Returned'];
  
  // Dropdown categories
  categories = ['Vehicles', 'Equipment', 'Staff'];
  currentCategory = 'Vehicles';
  isDropdownOpen = false;

  // Dynamic table headers and fields
  tableHeaders: string[] = [];
  tableFields: string[] = [];
  currentItems: any[] = [];
  // Toggle dropdown menu
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Select category from dropdown
  selectCategory(category: string) {
    this.currentCategory = category;
    this.isDropdownOpen = false;
    this.updateTable();
  }
  // Predefined data for each category
  vehicles = [
    {
      name: 'Toyota Camry',
      category: 'Car',
      capacity: 5,
      status: 'Available',
      plateNumber: 'AB-1234',
      lastUsed: '2024-11-01',
    },
    {
      name: 'Hyundai H-1',
      category: 'Van',
      capacity: 10,
      status: 'Available',
      plateNumber: 'XY-5678',
      lastUsed: '2024-10-15',
    },
    {
      name: '30 Seater Bus',
      category: 'Bus',
      capacity: 30,
      status: 'Available',
      plateNumber: 'ZP-9876',
      lastUsed: '2024-09-20',
    },
  ];

  equipment = [
    {
      name: 'Laptop',
      category: 'Electronics',
      availableUnits: 5,
      totalUnits: 10,
      status: 'Available',
      lastUsed: '2024-11-15',
    },
    {
      name: 'Projector',
      category: 'AV Equipment',
      availableUnits: 2,
      totalUnits: 5,
      status: 'In Use',
      lastUsed: '2024-11-10',
    },
  ];

  staff = [
    {
      name: 'John Doe',
      role: 'Driver',
      contact: '123-456-7890',
      status: 'Available',
      lastAssignment: '2024-11-20',
    },
    {
      name: 'Jane Smith',
      role: 'Guide',
      contact: '098-765-4321',
      status: 'In Use',
      lastAssignment: '2024-11-18',
    },
  ];

  // Modal state
  isModalOpen = false;
  selectedDetails: string[] = [];
  selectedChecklist: { name: string; quantity: number }[] = [];

  ngOnInit() {
    this.updateTable(); // Initialize the table
  }

  openDetailsModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveSelection() {
    console.log('Selected Checklist:', this.selectedChecklist);
    this.closeModal();
  }

  // Change category and update table
  changeCategory(event: any) {
    this.currentCategory = event.target.value;
    this.updateTable();
  }

  // Update table headers and fields based on category
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
      this.currentItems = this.vehicles;
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
      this.currentItems = this.equipment;
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
      this.currentItems = this.staff;
    }
  }

  toggleSelection(item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Add item to selectedChecklist if not already added
      if (!this.selectedDetails.includes(item.name)) {
        this.selectedDetails.push(item.name);
        this.selectedChecklist.push({ name: item.name, quantity: 1 });
      }
    } else {
      // Remove item from selectedChecklist
      this.selectedDetails = this.selectedDetails.filter(
        (detail) => detail !== item.name
      );
      this.selectedChecklist = this.selectedChecklist.filter(
        (checklistItem) => checklistItem.name !== item.name
      );
    }
  }
}
