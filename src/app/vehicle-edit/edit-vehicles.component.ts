import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resource, ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-vehicle-edit',
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
    status: '',
  };
  resourceId: string | null = null;
  previewImage: string | null = null;
  showModal: boolean = false;
  newCategory: string = '';
  categories: string[] = [];
  selectedType: string = 'vehicles'; // ค่าเริ่มต้น
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

  // Save updated vehicle
  saveVehicle(updatedResource: Resource): void {
    if (this.resourceId) {
      this.resourceService
        .updateResource(this.resourceId, updatedResource)
        .subscribe(
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
  }

  // Navigate back to resource list
  goBack() {
    this.router.navigate(['/resource'], {
      queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
    });
  }
}
