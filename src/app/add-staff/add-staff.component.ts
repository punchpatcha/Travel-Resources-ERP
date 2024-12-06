import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResourceService, Resource } from '../services/resource.service';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css'],
})
export class AddStaffComponent implements OnInit {
  // Staff data
  staff: Partial<Resource> = {
    type: 'Staff', 
    name: '',
    role: '',
    contact: '',
    status: 'Available',
    lastAssignment:'',
    image: '',
  };

  // List of available roles
  roles: string[] = [];
  newRole = '';
  showModal = false;
  previewImage: string | null = null;
  selectedType: string = 'staff'; // ค่าเริ่มต้น

  constructor(
    private resourceService: ResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadRoles(); // Load roles for staff
  }

  // Load staff roles
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
    if (this.staff.role === 'Add new role') {
      this.showModal = true;
    }
  }

  // Add new role
  addNewRole() {
    if (this.newRole.trim()) {
      this.roles.unshift(this.newRole);
      this.staff.role = this.newRole;
      this.showModal = false;
      this.newRole = '';
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
          this.staff.image = this.previewImage;
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
    this.staff.image = '';
  }

  // Validate form fields
  isFormValid(): boolean {
    return !!(
      this.staff.name &&
      this.staff.role &&
      this.staff.contact&&
      this.staff.status
    ) as boolean;
  }

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

  // Save staff
  saveStaff() {
    if (this.isFormValid()) {
      // ตรวจสอบว่า type เป็น 'Staff' แล้วไม่ต้องใส่ category
      if (this.staff.type === 'Staff') {
        this.staff.category = ''; // หรือกำหนดค่าอื่น ๆ ที่เหมาะสม เช่น null หรือ 'N/A'
      }
  
      console.log('Staff data being sent:', this.staff); // Debug log
  
      this.resourceService.createResource(this.staff as Resource).subscribe(
        (response) => {
          console.log('Staff added successfully:', response);
          this.router.navigate(['/resource'], {
            queryParams: { type: this.selectedType }, // ส่งค่าประเภทกลับ
          });
        },
        (error) => {
          console.error('Error adding staff:', error);
          if (error.error) {
            alert(`Backend error: ${error.error.error || 'Unknown error'}`);
          }
        }
      );
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
