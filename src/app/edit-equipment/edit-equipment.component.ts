import { Component, OnInit } from '@angular/core';
import { ResourceService, Resource } from '../services/resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-edit-equipment',
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.css'],
})
export class EditEquipmentComponent implements OnInit {
  resource: Resource = {
    _id: '',
    name: '',
    type: '',
    category: '',
    status: '',
  };
  resourceId: string | null = null;
  previewImage: string | null = null;
  showModal: boolean = false;
  newCategory: string = '';
  categories: string[] = [];
  selectedType: string = 'equipment'; // ค่าเริ่มต้น
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

  loadCategories(): void {
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

  saveChanges(updatedResource: Resource): void {
    if (this.resourceId) {
      this.resourceService
        .updateResource(this.resourceId, updatedResource)
        .subscribe(
          (response) => {
            console.log('Resource updated successfully:', response);
            alert('Resource updated successfully!');
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
  }

  goBack() {
    this.router.navigate(['/resource'], {
      queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
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
  
  // ฟังก์ชันสำหรับตรวจสอบการเปลี่ยนแปลงหมวดหมู่
  onCategoryChange() {
    if (this.resource.category === 'Add new category') {
      this.showModal = true;
    }
  }

  onStatusChange(status: string): void {
    console.log('Status changed:', status);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result; // เก็บภาพในรูปแบบ base64
        this.resource.image = this.previewImage; // แน่ใจว่าภาพถูกเก็บใน resource object
      };
      reader.readAsDataURL(file);
    }
  }

  onBrowseImage(): void {
    document.getElementById('imageUpload')?.click();
  }

  removeImage(): void {
    this.previewImage = null;
  }


  getStatusClass(status: string | undefined): string {
    return status === 'Available' ? 'status-available' : 'status-maintenance';
  }

  addNewCategory() {
    if (this.newCategory.trim()) {
      this.categories.unshift(this.newCategory);
      this.resource.category = this.newCategory;
      this.showModal = false;
      this.newCategory = '';
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
}
