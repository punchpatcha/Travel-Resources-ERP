import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resource, ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-edit-vehicles',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-vehicles.component.html',
  styleUrls: ['./edit-vehicles.component.css'],
})
export class EditVehiclesComponent implements OnInit {
  resource: Resource = {
    _id: '',
    name: '',
    type: '',
    category: '',
    plateNumber: '',
    capacity: 0,
    status: '',
  };
  resourceId: string | null = null;
  previewImage: string | null = null;
  showModal: boolean = false;
  newCategory: string = '';
  categories: string[] = [];
  selectedType: string = 'Vehicles'; // ค่าเริ่มต้น
  constructor(
    private resourceService: ResourceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resourceId = this.route.snapshot.paramMap.get('id');
    if (this.resourceId) {
      this.resourceService.getResource(this.resourceId).subscribe((data) => {
        this.resource = data;
        // ตรวจสอบว่าค่า image มีอยู่และเป็น base64 string หรือ URL ภายนอก
        if (this.resource.image) {
          if (this.resource.image) {
            this.previewImage = `http://localhost:3000/uploads/${this.resource.image}`; // แก้ไข URL ให้ตรงกับพอร์ต backend
          } else {
            this.previewImage = null;
          }
        }
      });
    }
    // ดึงค่า type จาก queryParams
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.selectedType = params['type'];
      }
    });
    this.loadCategories(); // ดึงหมวดหมู่จากฐานข้อมูลเมื่อเริ่มต้นคอมโพเนนต์
  }


  // Load categories
  loadCategories(): void {
    this.resourceService.getAvailableResources({ type: 'Vehicles' }).subscribe(
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

  // Handle category change
  onCategoryChange(): void {
    if (this.resource.category === 'Add new category') {
      this.showModal = true;
    }
  }

  // Add new category
  addNewCategory(): void {
    if (this.newCategory.trim()) {
      this.categories.unshift(this.newCategory);
      this.resource.category = this.newCategory;
      this.showModal = false;
      this.newCategory = '';
    }
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
  }

  // Handle image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this.resource.image = this.previewImage;
      };

      reader.readAsDataURL(file);
    }
  }

  onBrowseImage(): void {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput?.click();
  }

  removeImage(): void {
    this.previewImage = null;
    this.resource.image = '';
  }

  isPlateNumberValid(plateNumber: string): boolean {
    const regex = /^[A-Za-z]{2}-\d{4}$/; // รูปแบบ: ตัวอักษร 2 ตัว, ตามด้วย "-", และตัวเลข 4 หลัก
    return regex.test(plateNumber);
  }
  
  // ตรวจสอบความซ้ำซ้อนของ plateNumber
  isPlateNumberUnique(plateNumber: string, currentResourceId: string | null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.resourceService.getAvailableResources({ type: 'Vehicles' }).subscribe(
        (data) => {
          const existingResource = data.find((item) => item.plateNumber === plateNumber);
  
          // อนุญาตหากหมายเลขทะเบียนเป็นของทรัพยากรปัจจุบัน
          if (existingResource && existingResource._id === currentResourceId) {
            resolve(true);
          } else {
            resolve(!existingResource);
          }
        },
        (error) => {
          console.error('Error checking plate numbers:', error);
          reject(error);
        }
      );
    });
  }
  
  // ปรับปรุงใน saveVehicle
  saveVehicle(updatedResource: Resource): void {
    const plateNumber = updatedResource.plateNumber ?? ''; // กำหนดค่าเริ่มต้นหาก plateNumber เป็น undefined
  
    // ตรวจสอบว่า plateNumber ไม่ว่างเปล่า
    if (!plateNumber.trim()) {
      alert('Plate number is required. Please fill in the plate number.');
      return;
    }
  
    // ตรวจสอบรูปแบบของ plateNumber
    if (!this.isPlateNumberValid(plateNumber)) {
      alert('Invalid plate number format. Please use the format XX-1234.');
      return;
    }
  
    // ตรวจสอบความซ้ำซ้อนของ plateNumber
    this.isPlateNumberUnique(plateNumber, this.resourceId).then((isUnique) => {
      if (!isUnique) {
        alert('Plate number already exists. Please use a unique plate number.');
        return;
      }
  
      // หากผ่านการตรวจสอบทั้งหมด ให้ทำการบันทึกข้อมูล
      if (this.resourceId) {
        this.resourceService.updateResource(this.resourceId, updatedResource).subscribe(
          (response) => {
            console.log('Saving changes...');
            this.router.navigate(['/resource'], {
              queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
            });
          },
          (error) => {
            console.error('Error updating resource:', error);
            alert('Failed to update resource. Please try again.');
          }
        );
      }
    });
  }
  deleteResource(): void {
    if (this.resourceId) {
      const confirmDelete = confirm(
        `Are you sure you want to delete the resource "${this.resource.name}"?`
      );
      if (confirmDelete) {
        this.resourceService.deleteResource(this.resourceId).subscribe(
          () => {
            alert('Resource deleted successfully!');
            this.router.navigate(['/resource'], {
              queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
            });
          },
          (error) => {
            console.error('Error deleting resource:', error);
            alert('Failed to delete resource. Please try again.');
          }
        );
      }
    } else {
      alert('Resource ID not found.');
    }
  }

  // Navigate back to resource list
  goBack(): void {
    this.router.navigate(['/resource'], {
      queryParams: { type: this.selectedType }, 
    });
  }

  getStatusClass(status: string | undefined): string {
    return status === 'Available' ? 'status-available' : 'status-maintenance';
  }
}
