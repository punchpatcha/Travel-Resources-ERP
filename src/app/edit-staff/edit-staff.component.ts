import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resource, ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-edit-staff',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-staff.component.html',
  styleUrl: './edit-staff.component.css'
})
export class EditStaffComponent {
  resource: Resource = {
    _id: '',
    name: '',
    type: '',
    category: '',
    status: '',
    role: '',
  };
  resourceId: string | null = null;
  previewImage: string | null = null;
  showModal: boolean = false;
  newRole: string = '';
  roles: string[] = [];
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
    this.loadRoles(); // ดึงหมวดหมู่จากฐานข้อมูลเมื่อเริ่มต้นคอมโพเนนต์
  }


  // Load categories
  loadRoles() {
    this.resourceService.getAvailableResources({ type: 'Staff' }).subscribe(
      (data) => {
        const staffRoles = data.filter((item) => item.type === 'Staff');
        
        // Ensure roles are strings and filter out undefined
        const uniqueRoles = Array.from(
          new Set(staffRoles.map((item) => item.role).filter((role): role is string => !!role))
        );
  
        this.roles = uniqueRoles;
  
        // Add "Add new role" option if not already included
        if (!this.roles.includes('Add new role')) {
          this.roles.push('Add new role');
        }
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
  

  // Handle role change
  onRoleChange() {
    if (this.resource.role === 'Add new role') {
      this.showModal = true;
    }
  }

  // Add new role
  addNewRole() {
    if (this.newRole.trim()) {
      this.roles.unshift(this.newRole);
      this.resource.role = this.newRole;
      this.showModal = false;
      this.newRole = '';
    }
  }

  closeModal() {
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
  saveStaff(updatedResource: Resource): void {
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

