import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResourceService, Resource } from '../services/resource.service';

@Component({
  selector: 'app-add-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vehicles.component.html',
  styleUrls: ['./add-vehicles.component.css'],
})
export class AddVehiclesComponent implements OnInit {
  // Vehicle data
  vehicle: Partial<Resource> = {
    name: '',
    type: 'Vehicle',
    category: '',
    capacity: 1,
    status: 'Available',
    maintenanceDate: '',
    plateNumber: '',
    image: '',
  };

  // ตัวแปรสำหรับเก็บรายชื่อหมวดหมู่ที่มีอยู่
  categories: string[] = [];
  // ตัวแปรสำหรับเก็บหมวดหมู่ใหม่ที่กำลังเพิ่ม
  newCategory = '';
  // ตัวแปรสำหรับแสดงหรือซ่อนโมดัล
  showModal = false;
  // ตัวแปรสำหรับแสดงตัวอย่างภาพ
  previewImage: string | null = null;
  selectedType: string = 'vehicles'; // ค่าเริ่มต้น

  constructor(
    private resourceService: ResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Load categories for vehicles
  }

  // Load vehicle categories
  loadCategories() {
    this.resourceService.getAvailableResources({ type: 'Vehicles' }).subscribe(
      (data) => {
        // กรองข้อมูลที่ type เป็น 'Vehicles' เท่านั้น
        const vehicleCategories = data.filter(
          (item) => item.type === 'Vehicles'
        );

        // ดึงค่า category ที่ไม่ซ้ำกัน
        const uniqueCategories = Array.from(
          new Set(vehicleCategories.map((item) => item.category))
        );

        // กำหนดให้ categories เป็น uniqueCategories
        this.categories = uniqueCategories;

        // เพิ่มตัวเลือก "Add new category" ถ้ายังไม่มี
        if (!this.categories.includes('Add new category')) {
          this.categories.push('Add new category');
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Handle category change
  onCategoryChange() {
    if (this.vehicle.category === 'Add new category') {
      this.showModal = true;
    }
  }

  // Add new category
  addNewCategory() {
    if (this.newCategory.trim()) {
      this.categories.unshift(this.newCategory);
      this.vehicle.category = this.newCategory;
      this.showModal = false;
      this.newCategory = '';
    }
  }

  // ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงสถานะของอุปกรณ์
  onStatusChange(status: string) {
    console.log('Status changed to:', status);
    this.vehicle.status = status;
  }

  closeModal() {
    this.showModal = false;
  }

  // Image handling
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800;
          const maxHeight = 600;

          let width = image.width;
          let height = image.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(image, 0, 0, width, height);

          this.previewImage = canvas.toDataURL(file.type);
          this.vehicle.image = this.previewImage;
        };
      };

      reader.readAsDataURL(file);
    }
  }

  onBrowseImage(): void {
    const fileInput = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;
    fileInput?.click();
  }

  removeImage() {
    this.previewImage = null;
    this.vehicle.image = '';
  }

  isPlateNumberValid(plateNumber: string): boolean {
    const regex = /^[A-Za-z]{2}-\d{4}$/; // Pattern: Two letters, a dash, and four digits
    return regex.test(plateNumber);
  }

  isPlateNumberUnique(plateNumber: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.resourceService.getAvailableResources({ type: 'Vehicles' }).subscribe(
        (data) => {
          const existingPlateNumbers = data.map((item) => item.plateNumber);
          resolve(!existingPlateNumbers.includes(plateNumber));
        },
        (error) => {
          console.error('Error checking plate numbers:', error);
          reject(error);
        }
      );
    });
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

  // Validate form fields
  isFormValid(): boolean {
    return !!(
      this.vehicle.name &&
      this.vehicle.category &&
      this.vehicle.plateNumber &&
      this.vehicle.capacity &&
      this.vehicle.status
    ) as boolean;
  }

  // Save vehicle
  saveVehicle() {
    if (this.isFormValid()) {
      // ตรวจสอบความถูกต้องของ plateNumber
      if (!this.isPlateNumberValid(this.vehicle.plateNumber || '')) {
        alert('Invalid plate number. It must follow the format: AB-1234.');
        return;
      }
  
      // ตรวจสอบความซ้ำซ้อนของ plateNumber แบบ asynchronous
      this.isPlateNumberUnique(this.vehicle.plateNumber || '')
        .then((isUnique) => {
          if (!isUnique) {
            alert(
              'Plate number already exists. Please enter a unique plate number.'
            );
            return;
          }
  
          // Ensure valid maintenanceDate and type
          if (!this.vehicle.maintenanceDate) {
            this.vehicle.maintenanceDate = new Date().toISOString(); // Use the current date if undefined
          }
          if (this.vehicle.type !== 'Vehicles') {
            this.vehicle.type = 'Vehicles'; // Match backend enum value
          }
  
          console.log('Vehicle data being sent:', this.vehicle); // Debug log
  
          // ส่งข้อมูลไปยัง backend
          this.resourceService.createResource(this.vehicle as Resource).subscribe(
            (response) => {
              console.log('Vehicle added successfully:', response);
              this.router.navigate(['/resource'], {
                queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
              });
            },
            (error) => {
              console.error('Error adding vehicle:', error);
              if (error.error) {
                alert(`Backend error: ${error.error.error || 'Unknown error'}`);
              }
            }
          );
        })
        .catch((error) => {
          console.error('Error validating plate number:', error);
          alert('Failed to validate plate number. Please try again.');
        });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
  // Navigate back
  goBack() {
    this.router.navigate(['/resource'], {
      queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
    });
  }
}
