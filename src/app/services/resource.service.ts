import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resource {
  _id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  placeNumber?: string;
  capacity?: number;
  availableUnits?: number;
  totalUnits?: number;
  role?: string;
  contact?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = 'http://localhost:3000/api/resources';

  constructor(private http: HttpClient) {}

  getAvailableResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}?status=Available`);
  }
}
