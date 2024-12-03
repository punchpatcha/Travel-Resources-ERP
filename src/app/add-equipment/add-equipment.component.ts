import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-equipment',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-equipment.component.html',
  styleUrl: './add-equipment.component.css'
})
export class AddEquipmentComponent {
  constructor(private router: Router, private location : Location) {}
  previewImage: string | null = null;
  categories = ['Sedan', 'SUV', 'Truck', 'Van'];
  newCategory: string = ''; // ตัวแปรเก็บหมวดหมู่ใหม่
  showModal: boolean = false; // ใช้เพื่อแสดง/ซ่อน Modal

  equipment = {
    name: '',
    category: '',
    totalUnit: 1,
    status: 'Available',
    maintenanceDate: null as string | null
  };

  addNewCategory() {
    if (this.newCategory.trim()) {
      this.categories.push(this.newCategory); // เพิ่มหมวดหมู่ใหม่
      this.equipment.category = this.newCategory; // ตั้งค่าหมวดหมู่ที่เลือก
      this.closeModal(); // ปิด Modal
    }
  }

  // ปิด Modal
  closeModal() {
    this.showModal = false;
    this.newCategory = ''; // รีเซ็ตค่า input
  }

  onCategoryChange() {
    if (this.equipment.category === 'add-new') {
      this.showModal = true;
    }
  }
  
  incrementUnit() {
    this.equipment.totalUnit++;
  }
  
  decrementUnit() {
    if (this.equipment.totalUnit > 1) {
      this.equipment.totalUnit--;
    }
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

  cancel() {
    this.router.navigate(['/resources']);
  }

  onSubmit() {
    // ประมวลผลข้อมูลเมื่อฟอ.ร์มถูก submit
    console.log(this.equipment);
    // คุณสามารถเพิ่มการเรียก API หรือจัดการข้อมูลที่ได้รับที่นี่
  }

  isFormValid(): boolean {
    const { name, totalUnit, category, status } = this.equipment;
    console.log('Checking form validity: ', { name, totalUnit, category, status });
  
    return (
      name.trim() !== '' &&
      totalUnit > 0 &&
      category.trim() !== '' &&
      !!status
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Maintenance':
        return 'status-maintenance';
      default:
        return '';
    }
  }

  onStatusChange(status: string) {
    console.log('Status changed to:', status);
    this.equipment.status = status;

  }

  goBack(): void {
    this.location.back(); // นำทางกลับไปยังหน้าก่อนหน้า
  }
}
