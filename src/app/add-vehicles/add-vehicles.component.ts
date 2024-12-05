import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
    maintenanceDate: 'null',
    plateNumber: '',
    image: '',
  };

  categories: string[] = [];
  newCategory = '';
  showModal = false;
  previewImage: string | null = null;

  constructor(
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Load categories for vehicles
  }

  // Load vehicle categories
  loadCategories() {
    this.resourceService.getAvailableResources({ type: 'Vehicle' }).subscribe(
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

  // Get status class for styling
  getStatusClass(status?: string): string {
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
      this.resourceService.createResource(this.vehicle as Resource).subscribe(
        (response) => {
          console.log('Vehicle added successfully:', response);
          this.router.navigate(['/resource'], { queryParams: { type: 'vehicle' } });
        },
        (error) => {
          console.error('Error adding vehicle:', error);
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/resource'], { queryParams: { type: 'vehicle' } });
  }
}
