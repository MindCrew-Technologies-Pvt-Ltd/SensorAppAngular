import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anomaly } from '../../types/dashboard.types';

@Component({
  selector: 'app-anomaly-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './anomaly-alert.html',
  styleUrl: './anomaly-alert.css'
})
export class AnomalyAlert {
  anomaly = input<Anomaly | null>(null);
  
  dismiss = output<void>();

  onDismiss() {
    this.dismiss.emit();
  }
}