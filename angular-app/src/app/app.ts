import { Component, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';

// Shared Components
import { DashboardHeader } from './shared/components/dashboard-header/dashboard-header';
import { AnomalyAlert } from './shared/components/anomaly-alert/anomaly-alert';
import { ChartWidget } from './shared/components/chart-widget/chart-widget';
import { MetricsPanel } from './shared/components/metrics-panel/metrics-panel';
import { AnomalyHistory } from './shared/components/anomaly-history/anomaly-history';
import { SystemStatus } from './shared/components/system-status/system-status';

// Types
import { SensorReading, Anomaly, MetricData, StatusItem } from './shared/types/dashboard.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeader,
    AnomalyAlert,
    ChartWidget,
    MetricsPanel,
    AnomalyHistory,
    SystemStatus
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <app-dashboard-header
        [isStreaming]="isStreaming()"
        (toggleStreaming)="toggleStreaming()"
        (clearData)="clearData()"
      />

      <app-anomaly-alert
        [anomaly]="latestAnomaly()"
        (dismiss)="dismissAnomaly()"
      />

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <app-chart-widget
          title="Live Time-Series Chart (Last 300 Points)"
          [data]="chartData()"
        />

        <div class="stats-panel">
          <app-metrics-panel
            [metrics]="keyMetrics()"
          />

          <app-anomaly-history
            [anomalies]="recentAnomalies()"
          />

          <app-system-status
            [statusItems]="systemStatusItems()"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .dashboard {
      min-height: 100vh;
      background-color: #111827;
      color: white;
      padding: 1rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }
    }

    .stats-panel {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `]
})
export class App implements OnInit, OnDestroy {
  private streamingInterval: any = null;
  private readonly MAX_BUFFER_SIZE = 100000;
  private readonly CHART_DISPLAY_SIZE = 300;
  private readonly ANOMALY_THRESHOLD_LOW = 10;
  private readonly ANOMALY_THRESHOLD_HIGH = 90;

  // Signals for state management
  allReadings = signal<SensorReading[]>([]);
  isStreaming = signal(false);
  anomalies = signal<Anomaly[]>([]);
  latestAnomaly = signal<Anomaly | null>(null);
  
  // Computed signals for derived state
  chartData = computed(() => {
    const readings = this.allReadings();
    return readings.slice(-this.CHART_DISPLAY_SIZE);
  });

  totalCount = computed(() => this.allReadings().length);

  liveAverage = computed(() => {
    const readings = this.allReadings();
    const last100 = readings.slice(-100);
    if (last100.length === 0) return '0.00';
    const avg = last100.reduce((sum, reading) => sum + reading.value, 0) / last100.length;
    return avg.toFixed(2);
  });

  maxValue = computed(() => {
    const readings = this.allReadings();
    if (readings.length === 0) return '0.00';
    const max = Math.max(...readings.map(r => r.value));
    return max.toFixed(2);
  });

  minValue = computed(() => {
    const readings = this.allReadings();
    if (readings.length === 0) return '0.00';
    const min = Math.min(...readings.map(r => r.value));
    return min.toFixed(2);
  });

  recentAnomalies = computed(() => {
    return this.anomalies().slice(-5).reverse();
  });

  // Computed signals for component data
  keyMetrics = computed((): MetricData[] => [
    {
      label: 'Total Readings',
      value: this.totalCount().toString(),
      color: 'blue'
    },
    {
      label: 'Live Average (Last 100)',
      value: this.liveAverage(),
      color: 'green'
    },
    {
      label: '24-Hour Max',
      value: this.maxValue(),
      color: 'orange'
    },
    {
      label: '24-Hour Min',
      value: this.minValue(),
      color: 'purple'
    }
  ]);

  systemStatusItems = computed((): StatusItem[] => [
    {
      label: 'Streaming',
      value: this.isStreaming() ? 'Active' : 'Inactive',
      status: this.isStreaming() ? 'active' : 'inactive'
    },
    {
      label: 'Data Rate',
      value: '10 points/50ms',
      status: 'info'
    },
    {
      label: 'Buffer Size',
      value: '100,000 max',
      status: 'warning'
    }
  ]);

  ngOnInit() {
    // Start with some initial data
    this.generateInitialData();
  }

  ngOnDestroy() {
    this.stopStreaming();
  }

  private generateInitialData() {
    const initialData: SensorReading[] = [];
    const initialAnomalies: Anomaly[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 50; i++) {
      const value = Math.random() * 100;
      const timestamp = now - (50 - i) * 1000;
      const reading: SensorReading = {
        id: `SENS-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        value: value,
        timestamp: timestamp
      };
      
      initialData.push(reading);
      
      // Create some initial anomalies (values < 10 or > 90)
      if (value < this.ANOMALY_THRESHOLD_LOW || value > this.ANOMALY_THRESHOLD_HIGH) {
        const anomaly: Anomaly = {
          id: reading.id,
          value: reading.value,
          timestamp: reading.timestamp,
          formatted: format(new Date(reading.timestamp), 'MMM dd, HH:mm:ss')
        };
        initialAnomalies.push(anomaly);
      }
    }
    
    // Add a few more sample anomalies to ensure we have some data
    const sampleAnomalies: Anomaly[] = [
      {
        id: 'SENS-001',
        value: 5.2,
        timestamp: now - 300000, // 5 minutes ago
        formatted: format(new Date(now - 300000), 'MMM dd, HH:mm:ss')
      },
      {
        id: 'SENS-045',
        value: 95.8,
        timestamp: now - 180000, // 3 minutes ago
        formatted: format(new Date(now - 180000), 'MMM dd, HH:mm:ss')
      },
      {
        id: 'SENS-123',
        value: 2.1,
        timestamp: now - 120000, // 2 minutes ago
        formatted: format(new Date(now - 120000), 'MMM dd, HH:mm:ss')
      },
      {
        id: 'SENS-078',
        value: 98.7,
        timestamp: now - 60000, // 1 minute ago
        formatted: format(new Date(now - 60000), 'MMM dd, HH:mm:ss')
      },
      {
        id: 'SENS-234',
        value: 7.3,
        timestamp: now - 30000, // 30 seconds ago
        formatted: format(new Date(now - 30000), 'MMM dd, HH:mm:ss')
      }
    ];
    
    this.allReadings.set(initialData);
    this.anomalies.set([...initialAnomalies, ...sampleAnomalies]);
    
    // Set the most recent anomaly as the latest
    const allAnomalies = [...initialAnomalies, ...sampleAnomalies];
    if (allAnomalies.length > 0) {
      const latestAnomaly = allAnomalies[allAnomalies.length - 1];
      this.latestAnomaly.set(latestAnomaly);
    }
  }

  toggleStreaming() {
    if (this.isStreaming()) {
      this.stopStreaming();
    } else {
      this.startStreaming();
    }
  }

  private startStreaming() {
    this.isStreaming.set(true);
    
    this.streamingInterval = setInterval(() => {
      this.generateDataBatch();
    }, 50);
  }

  private stopStreaming() {
    this.isStreaming.set(false);
    
    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
      this.streamingInterval = null;
    }
  }

  private generateDataBatch() {
    const newReadings: SensorReading[] = [];
    const now = Date.now();
    
    // Generate 10 new data points
    for (let i = 0; i < 10; i++) {
      const reading: SensorReading = {
        id: `SENS-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        value: Math.random() * 100,
        timestamp: now + i
      };
      
      newReadings.push(reading);
      
      // Check for anomaly
      if (reading.value < this.ANOMALY_THRESHOLD_LOW || reading.value > this.ANOMALY_THRESHOLD_HIGH) {
        this.addAnomaly(reading);
      }
    }
    
    // Update readings with FIFO logic
    const currentReadings = this.allReadings();
    const updatedReadings = [...currentReadings, ...newReadings];
    
    // Maintain buffer size
    if (updatedReadings.length > this.MAX_BUFFER_SIZE) {
      const excess = updatedReadings.length - this.MAX_BUFFER_SIZE;
      updatedReadings.splice(0, excess);
    }
    
    this.allReadings.set(updatedReadings);
  }

  private addAnomaly(reading: SensorReading) {
    const anomaly: Anomaly = {
      id: reading.id,
      value: reading.value,
      timestamp: reading.timestamp,
      formatted: format(new Date(reading.timestamp), 'MMM dd, HH:mm:ss')
    };
    
    // Add to anomalies list
    const currentAnomalies = this.anomalies();
    this.anomalies.set([...currentAnomalies, anomaly]);
    
    // Set as latest anomaly for banner
    this.latestAnomaly.set(anomaly);
  }

  dismissAnomaly() {
    this.latestAnomaly.set(null);
  }

  clearData() {
    this.allReadings.set([]);
    this.anomalies.set([]);
    this.latestAnomaly.set(null);
  }
}
