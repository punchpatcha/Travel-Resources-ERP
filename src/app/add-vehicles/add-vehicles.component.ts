import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-add-vehicles',
  templateUrl: './add-vehicles.component.html',
  styleUrls: ['./add-vehicles.component.css']
})
export class AddVehiclesComponent {

   // รายการพาหนะที่มีอยู่
   item = [
    { id: 1, name: 'Toyota Camry', category: 'Sedan', plateNumber: 'AB-1234', capacity: 5, status: 'Available', maintenanceDate: '2024-12-01' },
    { id: 2, name: 'Honda Accord', category: 'SUV', plateNumber: 'CD-5678', capacity: 7, status: 'Under Maintenance', maintenanceDate: '2024-11-30' }
  ];

  // อ็อบเจ็กต์สำหรับพาหนะใหม่
  vehicles = {
    id: 0,
    name: '',
    category: '',
    plateNumber: '',
    capacity: 0,
    status: '',
    maintenanceDate: null as string | null
  };

  // Regular Expression สำหรับตรวจสอบรูปแบบเลขทะเบียน
  plateNumberPattern = /^[A-Z]{2}-\d{4}$/;

  // ตัวแปรสำหรับจัดการหมวดหมู่
  categories = ['Sedan', 'SUV', 'Truck', 'Van']; // หมวดหมู่เริ่มต้น
  newCategory: string = ''; // ตัวแปรเก็บหมวดหมู่ใหม่
  showModal: boolean = false; // ใช้เพื่อแสดง/ซ่อน Modal

  // แสดงภาพที่เลือก
  previewImage: string | null = null;

  constructor(private router: Router, 
    private location: Location){}


  // ตรวจสอบเลขทะเบียนรถยนต์ว่าถูกต้องหรือไม่ และไม่ซ้ำ
  isPlateNumberValid(plateNumber: string): boolean {
    // ตรวจสอบรูปแบบเลขทะเบียน
    if (!this.plateNumberPattern.test(plateNumber)) {
      return false; // คืนค่า false หากรูปแบบไม่ถูกต้อง
    }
  
    // ตรวจสอบความซ้ำของเลขทะเบียน
    const isDuplicate = this.item.some((item) => item.plateNumber === plateNumber);
    return !isDuplicate; // คืน true ถ้าไม่มีเลขทะเบียนซ้ำ
  }

  // เพิ่มหมวดหมู่ใหม่
  addNewCategory() {
    if (this.newCategory.trim()) {
      this.categories.push(this.newCategory); // เพิ่มหมวดหมู่ใหม่
      this.vehicles.category = this.newCategory; // ตั้งค่าหมวดหมู่ที่เลือก
      this.closeModal(); // ปิด Modal
    }
  }

  // ปิด Modal
  closeModal() {
    this.showModal = false;
    this.newCategory = ''; // รีเซ็ตค่า input
  }

  // แสดง Modal เมื่อเลือก "Add New"
  onCategoryChange() {
    if (this.vehicles.category === 'add-new') {
      this.showModal = true;
    }
  }

  // เพิ่มข้อมูลรถยนต์ใหม่
  addVehicle() {
    const { name, plateNumber, capacity, category, maintenanceDate } = this.vehicles;
  
    if (!name.trim() || !plateNumber.trim() || capacity <= 0 || !category) {
      console.error('Please complete all required fields.');
      return;
    }
  
    if (this.isPlateNumberValid(plateNumber)) {
      // เพิ่มข้อมูลรถยนต์ใหม่และตรวจสอบ maintenanceDate
      this.item.push({
        ...this.vehicles,
        maintenanceDate: this.vehicles.maintenanceDate || "", // ถ้า maintenanceDate เป็น null จะใช้ "" แทน
        id: this.item.length + 1
      });
      console.log('Vehicle added successfully:', this.vehicles);
      this.resetForm();
    } else {
      console.error('Invalid or duplicate plate number.');
    }
  }

  // รีเซ็ตฟอร์ม
  resetForm() {
    this.vehicles = {
      id: 0,
      name: '',
      category: '',
      plateNumber: '',
      capacity: 0,
      status: 'Available',
      maintenanceDate: null
    };
    this.previewImage = null;
  }

  // ตรวจสอบว่าแบบฟอร์มถูกกรอกครบหรือไม่
  isFormValid(): boolean {
    const { name, plateNumber, capacity, category, status } = this.vehicles;
    console.log('Checking form validity: ', { name, plateNumber, capacity, category, status });
  
    return (
      name.trim() !== '' &&
      plateNumber.trim() !== '' &&
      capacity > 0 &&
      category.trim() !== '' &&
      status.trim() !== '' 
    );
  }
  
  
  // จัดการเลือกไฟล์ภาพ
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  // เปิดตัวเลือกไฟล์ภาพ
  onBrowseImage(): void {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput?.click();
  }

    // ฟังก์ชันลบภาพที่เลือก
    removeImage(): void {
      this.previewImage = null; // รีเซ็ตค่าของ previewImage
    }

  // ฟังก์ชัน Submit
  onSubmit() {
    this.isFormValid(),
    console.log('Vehicles List:', this.item);
  }

  // ฟังก์ชัน Cancel เพื่อกลับไปยังหน้า Resources
  cancel() {
    this.router.navigate(['/resources']);
  }

  // เปลี่ยนสีสถานะตามค่าที่เลือก
  getStatusClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Maintenance':
        return 'status-maintenance';
      default:
        return 'Available';
    }
  }

  goBack(): void {
    this.location.back(); // นำทางกลับไปยังหน้าก่อนหน้า
  }
}
