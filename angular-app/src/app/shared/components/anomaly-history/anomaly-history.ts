import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anomaly } from '../../types/dashboard.types';

@Component({
  selector: 'app-anomaly-history',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './anomaly-history.html',
  styleUrl: './anomaly-history.css'
})
export class AnomalyHistory {
  title = input<string>('Recent Anomalies');
  anomalies = input<Anomaly[]>([]);
  emptyMessage = input<string>('No anomalies detected');

  getAlertType(anomaly: Anomaly): string {
    return anomaly.value > 90 ? 'High Value Alert' : 'Low Value Alert';
  }

  getAnomalyItemClass(anomaly: Anomaly): string {
    const baseClass = 'anomaly-item-base';
    const typeClass = anomaly.value > 90 ? 'anomaly-item-high' : 'anomaly-item-low';
    return `${baseClass} ${typeClass}`;
  }

  getAlertTypeClass(anomaly: Anomaly): string {
    const baseClass = 'alert-type-base';
    const typeClass = anomaly.value > 90 ? 'alert-type-high' : 'alert-type-low';
    return `${baseClass} ${typeClass}`;
  }

  getFormattedTime(anomaly: Anomaly): string {
    return new Date(anomaly.timestamp).toLocaleTimeString();
  }
}