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

  // Cache for computed values to avoid recalculation
  private alertTypeCache = new Map<number, string>();
  private classCache = new Map<number, string>();

  getAlertType(anomaly: Anomaly): string {
    if (!this.alertTypeCache.has(anomaly.timestamp)) {
      const type = anomaly.value > 90 ? 'High Value Alert' : 'Low Value Alert';
      this.alertTypeCache.set(anomaly.timestamp, type);
    }
    return this.alertTypeCache.get(anomaly.timestamp)!;
  }

  getAnomalyItemClass(anomaly: Anomaly): string {
    if (!this.classCache.has(anomaly.timestamp)) {
      const baseClass = 'anomaly-item-base';
      const typeClass = anomaly.value > 90 ? 'anomaly-item-high' : 'anomaly-item-low';
      this.classCache.set(anomaly.timestamp, `${baseClass} ${typeClass}`);
    }
    return this.classCache.get(anomaly.timestamp)!;
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