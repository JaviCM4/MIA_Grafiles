import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  private data: any = {};

  constructor() {}

  setData(key: string, value: any): void {
    this.data[key] = value;
  }
    
  getData(key: string): any {
    return this.data[key];
  }

  resetData() {
    this.data = {};
  }
}