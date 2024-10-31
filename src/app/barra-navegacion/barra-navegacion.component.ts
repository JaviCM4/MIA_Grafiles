import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css'
})
export class BarraNavegacionComponent implements OnInit {
  rol!: number;

  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    this.rol = this.dataService.getData('rol')
  }

}
