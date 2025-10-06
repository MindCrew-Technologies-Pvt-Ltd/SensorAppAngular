import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css'
})
export class DashboardHeader {
  title = input<string>('Real-Time Sensor Analytics Dashboard');
  isStreaming = input<boolean>(false);
  
  toggleStreaming = output<void>();
  clearData = output<void>();

  onToggleStreaming() {
    this.toggleStreaming.emit();
  }

  onClearData() {
    this.clearData.emit();
  }
}