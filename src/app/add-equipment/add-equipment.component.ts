import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService, Resource } from '../services/resource.service';

@Component({
  selector: 'app-add-equipment',
  standalone: true,
  templateUrl: './add-equipment.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['./add-equipment.component.css'],
})
export class AddEquipmentComponent implements OnInit {
  // ตัวแปรที่ใช้เก็บข้อมูลอุปกรณ์ใหม่
  equipment: Partial<Resource> = {
    name: '',
    type: 'Equipment',
    category: '',
    totalUnits: 1,
    availableUnits: 1,
    status: 'Available',
    maintenanceDate: '',
    image: '',
  };

  selectedType: string = 'equipment'; // ค่าเริ่มต้น
  // ตัวแปรสำหรับเก็บรายชื่อหมวดหมู่ที่มีอยู่
  categories: string[] = [];
  // ตัวแปรสำหรับเก็บหมวดหมู่ใหม่ที่กำลังเพิ่ม
  newCategory = '';
  // ตัวแปรสำหรับแสดงหรือซ่อนโมดัล
  showModal = false;
  // ตัวแปรสำหรับแสดงตัวอย่างภาพ
  previewImage: string | null = null;

  constructor(
    private resourceService: ResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ฟังก์ชันที่ทำงานตอนเริ่มต้นการโหลดคอมโพเนนต์
  ngOnInit() {
    this.loadCategories(); // โหลดรายชื่อหมวดหมู่ที่มีอยู่
    // ดึงค่า type จาก queryParams
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectedType = params['type'];
      }
    });
  }

  // ฟังก์ชันสำหรับโหลดหมวดหมู่ที่ใช้ในอุปกรณ์
  loadCategories() {
    this.resourceService.getAvailableResources({ type: 'Equipment' }).subscribe(
      (data) => {
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        this.categories = uniqueCategories;
        if (!this.categories.includes('Add new category')) {
          this.categories.push('Add new category');
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงหมวดหมู่
  onCategoryChange() {
    if (this.equipment.category === 'Add new category') {
      this.showModal = true;
    }
  }

  // ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงสถานะของอุปกรณ์
  onStatusChange(status: string) {
    console.log('Status changed to:', status);
    this.equipment.status = status;
  }

  // ฟังก์ชันสำหรับปิดโมดัล
  closeModal() {
    this.showModal = false;
  }

  // ฟังก์ชันสำหรับเพิ่มหมวดหมู่ใหม่
  addNewCategory() {
    if (this.newCategory.trim()) {
      this.categories.unshift(this.newCategory);
      this.equipment.category = this.newCategory;
      this.showModal = false;
      this.newCategory = '';
    }
  }

  // ฟังก์ชันสำหรับเพิ่มจำนวนหน่วย
  incrementUnit() {
    if (this.equipment.totalUnits != null) {
      this.equipment.totalUnits++;
    }
  }

  // ฟังก์ชันสำหรับลดจำนวนหน่วย
  decrementUnit() {
    if (this.equipment.totalUnits && this.equipment.totalUnits > 1) {
      this.equipment.totalUnits--;
    }
  }

  //ส่วนของเลือกรูป จัดการขนาดรูป ไม่ให้ใหญ่เกินไป
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const image = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        image.src = e.target.result;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800; // กำหนดขนาดสูงสุด
          const maxHeight = 600;

          let width = image.width;
          let height = image.height;

          // ตรวจสอบขนาดภาพ
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          // ตั้งขนาด canvas ให้เป็นขนาดใหม่
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(image, 0, 0, width, height);

          // แปลงภาพเป็น Base64 และตั้งค่าให้แสดงตัวอย่าง
          this.previewImage = canvas.toDataURL(file.type);
          this.equipment.image = this.previewImage;
        };
      };

      reader.readAsDataURL(file);
    }
  }

  // ฟังก์ชันสำหรับเปิดช่องเลือกรูปภาพ
  onBrowseImage(): void {
    const fileInput = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;
    fileInput?.click();
  }

  // ฟังก์ชันสำหรับกำหนดคลาส CSS ตามสถานะ แต้งสี
  getStatusClass(status?: string): string {
    if (!status) {
      return 'status-default'; // ค่าเริ่มต้นเมื่อไม่มีค่า `status`
    }
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Maintenance':
        return 'status-maintenance';
      default:
        return 'status-default';
    }
  }

  // ฟังก์ชันสำหรับลบภาพตัวอย่าง
  removeImage(): void {
    this.previewImage = null; // รีเซ็ตค่าของ previewImage
  }

  // ฟังก์ชันสำหรับบันทึก equipment ใหม่
  saveEquipment() {
    if (this.isFormValid()) {
      const newResource: Resource = {
        ...this.equipment,
        availableUnits: this.equipment.totalUnits, // ตั้งค่าให้ Available Units เท่ากับ Total Units ตอนสร้างใหม่
      } as Resource;

      this.resourceService.createResource(newResource).subscribe(
        (response) => {
          console.log('Equipment added successfully:', response);
          // เพิ่ม queryParams ที่ type เป็น 'equipment เพื่อให้กลับไปเห็น resource ใหม่'
          console.log('Saving equipment...');
          this.router.navigate(['/resource'], {
            queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
          });
        },
        (error) => {
          console.error('Error adding equipment:', error);
        }
      );
    } else {
      console.warn('Form is incomplete or invalid');
    }
  }

  // ฟังก์ชันสำหรับกลับไปยังหน้า Resource

  goBack() {
    this.router.navigate(['/resource'], {
      queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
    });
  }

  // ฟังก์ชันสำหรับตรวจสอบความครบถ้วนของฟอร์ม
  isFormValid(): boolean {
    return !!(
      this.equipment.name &&
      this.equipment.category &&
      this.equipment.totalUnits &&
      this.equipment.status
    );
  }
}
