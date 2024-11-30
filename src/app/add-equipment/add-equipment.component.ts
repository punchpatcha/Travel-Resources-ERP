import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-equipment',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-equipment.component.html',
  styleUrl: './add-equipment.component.css'
})
export class AddEquipmentComponent {
  constructor(private router: Router) {}
  equipment = {
    name: '',
    category: '',
    totalUnit: 1,
    status: '',
    maintenanceDate: null
  };
  
  incrementUnit() {
    this.equipment.totalUnit++;
  }
  
  decrementUnit() {
    if (this.equipment.totalUnit > 1) {
      this.equipment.totalUnit--;
    }
  }
  cancel() {
    this.router.navigate(['/resources']);
  }

  onSubmit() {
    // ประมวลผลข้อมูลเมื่อฟอ.ร์มถูก submit
    console.log(this.equipment);
    // คุณสามารถเพิ่มการเรียก API หรือจัดการข้อมูลที่ได้รับที่นี่
  }
}
