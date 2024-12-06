import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule,CommonModule],
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css'] 
  
})
export class AppComponent {
  isSidebarOpen = false;
  isModalOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(event: Event) {
    // ปิด sidebar ถ้าคลิกข้างนอก (แต่ไม่ปิดถ้าคลิก sidebar หรือ hamburger menu)
    const target = event.target as HTMLElement;
    if (!target.closest('.sidebar') && !target.closest('.hamburger')) {
      this.isSidebarOpen = false;
    }
  }


  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
}
