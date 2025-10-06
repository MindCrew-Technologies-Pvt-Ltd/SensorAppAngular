import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusItem } from '../../types/dashboard.types';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './system-status.html',
  styleUrl: './system-status.css'
})
export class SystemStatus {
  title = input<string>('System Status');
  statusItems = input<StatusItem[]>([]);
}