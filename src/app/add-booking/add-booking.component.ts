import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-add-booking',
  standalone: true,
  templateUrl: './add-booking.component.html',
  imports: [
    CommonModule,RouterModule,FormsModule
  ],
  styleUrls: ['./add-booking.component.css'],
  
})
export class AddBookingComponent {
  bookingData = {
    customerName: '',
    startDate: '',
    endDate: '',
    status: '',
  };
  
   // Properties for details
   selectedChecklist: { name: string; quantity: number }[] = []; 

  statuses = ['Pending', 'Booked', 'In Use', 'Returned'];
  categories = ['Vehicles', 'Equipment', 'Staff'];
  currentCategory = 'Vehicles';
  isModalOpen = false;
  selectedDetails: string[] = [];
  currentItems = [
    { name: 'Toyota Camry', category: 'Car', capacity: 5, status: 'Available', plateNumber: 'AB-1234', lastUsed: '2024-11-01' },
    { name: 'Hyundai H-1', category: 'Van', capacity: 10, status: 'Available', plateNumber: 'XY-5678', lastUsed: '2024-10-15' },
    { name: '30 Seater Bus', category: 'Bus', capacity: 30, status: 'Available', plateNumber: 'ZP-9876', lastUsed: '2024-09-20' },
    { name: 'Toyota Camry', category: 'Car', capacity: 5, status: 'Available', plateNumber: 'AB-1234', lastUsed: '2024-11-01' }
  ];
  
  openDetailsModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveSelection() {
    // ตรวจสอบ selectedChecklist ก่อนบันทึก
    console.log("Selected Checklist:", this.selectedChecklist);
    this.closeModal();
  }
  
  
  changeCategory(event: any) {
    this.currentCategory = event.target.value;
    // Update currentItems based on category (hardcoded for now)
  }



  toggleSelection(item: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {
      // Add category to selectedDetails if not already selected
      if (!this.selectedDetails.includes(item.category)) {
        this.selectedDetails.push(item.category);
      }
  
      // Find existing item in selectedChecklist and update quantity
      const existingItem = this.selectedChecklist.find(
        checklistItem => checklistItem.name === item.name
      );
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.selectedChecklist.push({ name: item.name, quantity: 1 });
      }
    } else {
      // Remove item from selectedDetails and selectedChecklist
      this.selectedDetails = this.selectedDetails.filter(detail => detail !== item.category);
      this.selectedChecklist = this.selectedChecklist.filter(checklistItem => checklistItem.name !== item.name);
    }
  }
        
  
  

  saveDetails() {
    this.isModalOpen = false;
  }

  saveBooking() {
    console.log('Booking saved:', this.bookingData, this.selectedDetails);
  }
}
