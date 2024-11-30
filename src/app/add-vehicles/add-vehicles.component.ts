import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-add-vehicles',
  templateUrl: './add-vehicles.component.html',
  styleUrls: ['./add-vehicles.component.css']
})
export class AddVehiclesComponent {
  constructor(private router: Router) {}

  // รายการพาหนะที่มีอยู่
  item = [
    { id: 1, name: 'Toyota Camry', category: '', plateNumber: 'AB-1234',  capacity: 0, status: 'Available', maintenanceDate: null },
    { id: 2, name: 'Honda Accord', category: '', plateNumber: 'CD-5678',  capacity: 0, status: 'Available', maintenanceDate: null }
  ];

  // อ็อบเจ็กต์สำหรับพาหนะใหม่
  vehicles = {
    id: 0,
    name: '',
    category: '',
    plateNumber: '',
    capacity: 0,
    status: 'Available',
    maintenanceDate: null
  };

  // Regular Expression สำหรับตรวจสอบรูปแบบเลขทะเบียน
  plateNumberPattern = /^[A-Z]{2}-\d{4}$/;

  // ฟังก์ชันตรวจสอบรูปแบบและความซ้ำของเลขทะเบียน
  isPlateNumberValid(plateNumber: string): boolean {
    // ตรวจสอบรูปแบบด้วย Regular Expression
    if (!this.plateNumberPattern.test(plateNumber)) {
      console.error('Invalid Plate Number format.');
      return false;
    }

    // ตรวจสอบว่าเลขทะเบียนซ้ำหรือไม่
    const isDuplicate = this.item.some((item) => item.plateNumber === plateNumber);
    if (isDuplicate) {
      console.error('Duplicate Plate Number found.');
      return false;
    }

    return true;
  }

  // ฟังก์ชันเพิ่มพาหนะใหม่
  addVehicle() {
    const { name, plateNumber } = this.vehicles;

    if (name.trim() === '' || plateNumber.trim() === '') {
      console.error('Name and Plate Number are required.');
      return;
    }

    if (this.isPlateNumberValid(plateNumber)) {
      this.item.push({
        id: this.item.length + 1,
        name,
        category: '',
        plateNumber,
        capacity: 0,
        status: 'Available',
        maintenanceDate: this.vehicles.maintenanceDate
      });
      console.log('Vehicle added successfully:', this.vehicles);

      // รีเซ็ตฟอร์ม
      this.resetForm();
    } else {
      console.error('Failed to add vehicle. Invalid or duplicate Plate Number.');
    }
  }

  // ฟังก์ชันรีเซ็ตฟอร์ม
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
  }

  // ฟังก์ชัน Cancel เพื่อกลับไปยังหน้า Resources
  cancel() {
    this.router.navigate(['/resources']);
  }

  onSubmit() {
    // ประมวลผลข้อมูลเมื่อฟอร์มถูก submit
    console.log(this.item);
    // คุณสามารถเพิ่มการเรียก API หรือจัดการข้อมูลที่ได้รับที่นี่
  }
}
