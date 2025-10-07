import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricData } from '../../types/dashboard.types';

@Component({
  selector: 'app-metrics-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metrics-panel.html',
  styleUrl: './metrics-panel.css'
})
export class MetricsPanel {
  title = input<string>('Key Metrics');
  metrics = input<MetricData[]>([]);
}