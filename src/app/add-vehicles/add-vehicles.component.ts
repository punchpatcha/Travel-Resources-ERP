import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceService } from '../services/resource.service';
import { HttpClient } from '@angular/common/http';


@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-add-vehicles',
  templateUrl: './add-vehicles.component.html',
  styleUrls: ['./add-vehicles.component.css'],
})
export class AddVehiclesComponent {
  vehicles = {
    name: '',
    category: '',
    plateNumber: '',
    capacity: 0,
    status: '',
    maintenanceDate: 'null',
    type: 'vehicle',  // ประเภทนี้เป็น vehicle
    image: null,
  };
  
  categories: string[] = [];
  newCategory: string = '';
  showModal: boolean = false;
  previewImage: string = '';
  apiUrl: string = 'http://localhost:3000/api/resources';

  constructor(private resourceService: ResourceService,
    private http: HttpClient,
  ) {}

  loadCategories() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        // กรองเฉพาะรายการที่มี type เป็น 'Vehicles'
        const vehicleCategories = data.filter((item) => item.type === 'Vehicles');
  
        // ดึงข้อมูล category และกรองค่าที่ซ้ำ
        const uniqueCategories = Array.from(
          new Set(vehicleCategories.map((item) => item.category))
        );
  
        // อัปเดตรายการ categories โดยลบค่า null/undefined
        this.categories = uniqueCategories.filter((category) => !!category);
      },
      (error) => {
        console.error('Error loading categories:', error);
        alert('ไม่สามารถโหลดหมวดหมู่ได้');
      }
    );
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newCategory = ''; // รีเซ็ตหมวดหมู่ใหม่
  }

  addNewCategory() {
    if (this.newCategory.trim()) {
      // เพิ่มหมวดหมู่ใหม่เข้าไปในรายการ categories
      this.categories.push(this.newCategory.trim());
      // ตั้งค่า category ของ vehicles เป็นหมวดหมู่ใหม่
      this.vehicles.category = this.newCategory.trim();
      // ปิด modal
      this.closeModal();
    } else {
      alert('กรุณากรอกชื่อหมวดหมู่');
    }
  }

  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    if (selectedCategory === 'add-new') {
      this.showModal = true; // แสดง Modal
    } else {
      this.vehicles.category = selectedCategory; // กำหนดค่า category
    }
  }

  onSubmit() {
    // Ensure capacity is a valid number (if it's not, set it to 0)
    const validCapacity = isNaN(this.vehicles.capacity) ? 0 : this.vehicles.capacity;
  
    this.resourceService.createVehicle({
      name: this.vehicles.name,
      category: this.vehicles.category,
      plateNumber: this.vehicles.plateNumber,
      capacity: validCapacity,  // Ensure capacity is a valid number
      status: this.vehicles.status,
      maintenanceDate: this.vehicles.maintenanceDate,
      type: 'vehicle',  // Assuming this is a vehicle, set type accordingly
      image: this.previewImage ? this.previewImage : null,  // Handle image if present
      _id: ''  // Passing a dummy value for _id
    }).subscribe(response => {
      console.log('Vehicle created:', response);
    });
  }

  // ฟังก์ชันสำหรับการเลือกภาพ
  onBrowseImage() {
    document.getElementById('imageUpload')?.click();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
    }
  }

  removeImage() {
    this.previewImage = '';
  }

  getStatusClass(status: string): string {
    // Example: Add classes based on the status value
    switch (status) {
      case 'Available':
        return 'status-available';  // Define the class 'status-active' in CSS
      case 'Booked':
        return 'status-inactive';  // Define the class 'status-inactive' in CSS
      case 'Mainenace':
        return 'status-maintenance';  // Define the class 'status-maintenance' in CSS
      default:
        return 'status-default';  // Default class for undefined status
    }
  }

  isFormValid(): boolean {
    console.log(this.vehicles);
    return (
      this.vehicles.name !== '' &&
      this.vehicles.category !== '' &&
      this.vehicles.plateNumber !== '' &&
      this.vehicles.capacity > 0 &&
      this.vehicles.status !== ''
    );
  }

  deleteVehicle(){

  }

  goBack(){

  }
}
