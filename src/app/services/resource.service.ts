//src\app\services\resource.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resource {
  _id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  placeNumber?: string;  // ถ้า placeNumber ยังมีอยู่
  plateNumber?: string;  // เพิ่ม plateNumber ในที่นี้
  capacity?: number;
  availableUnits?: number;
  totalUnits?: number;
  role?: string;
  contact?: string;
  maintenanceDate?: string;
  image?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = 'http://localhost:3000/api/resources';

  constructor(private http: HttpClient) {}

  getAvailableResources(filters: any = {}): Observable<Resource[]> {
    const params = new URLSearchParams(filters).toString();
    return this.http.get<Resource[]>(`${this.apiUrl}?${params}`);
  }

  getAllResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }
  
  getResource(id: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/${id}`);
  }

  
  createResource(resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resource);
  }

  updateResource(id: string, updates: Partial<Resource>): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/${id}`, updates);
  }
  

  deleteResource(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createVehicle(vehicle: Resource): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/vehicles`, vehicle);
  }
  
  updateVehicle(id: string, updates: Partial<Resource>): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/vehicles/${id}`, updates);
  }
  
  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vehicles/${id}`);
  }
}
