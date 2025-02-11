import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {
@Input ()detail:any
}
