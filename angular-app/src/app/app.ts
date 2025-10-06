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
  templateUrl: './app.html',
  styleUrl: './app.css'
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

  // Optimized computed signals with memoization
  private readonly _statsCache = {
    readings: null as SensorReading[] | null,
    max: 0,
    min: 0,
    sum: 0
  };

  // Optimized statistics computation with caching
  private computeStats = computed(() => {
    const readings = this.allReadings();
    if (readings === this._statsCache.readings) {
      return {
        max: this._statsCache.max,
        min: this._statsCache.min,
        sum: this._statsCache.sum
      };
    }

    // Only recalculate when readings change
    if (readings.length === 0) {
      return { max: 0, min: 0, sum: 0 };
    }

    let max = readings[0].value;
    let min = readings[0].value;
    let sum = 0;

    // Single pass through the data
    for (const reading of readings) {
      const value = reading.value;
      sum += value;
      if (value > max) max = value;
      if (value < min) min = value;
    }

    // Cache the results
    this._statsCache.readings = readings;
    this._statsCache.max = max;
    this._statsCache.min = min;
    this._statsCache.sum = sum;

    return { max, min, sum };
  });

  liveAverage = computed(() => {
    const readings = this.allReadings();
    if (readings.length === 0) return '0.00';
    
    const last100 = readings.length > 100 ? readings.slice(-100) : readings;
    const sum = last100.reduce((acc, reading) => acc + reading.value, 0);
    return (sum / last100.length).toFixed(2);
  });

  maxValue = computed(() => {
    const stats = this.computeStats();
    return stats.max.toFixed(2);
  });

  minValue = computed(() => {
    const stats = this.computeStats();
    return stats.min.toFixed(2);
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

  // Optimized data generation with batch processing
  private generateDataBatch() {
    const now = Date.now();
    const batchSize = 10;
    const newReadings: SensorReading[] = new Array(batchSize);
    const newAnomalies: Anomaly[] = [];
    
    // Pre-allocate arrays for better performance
    for (let i = 0; i < batchSize; i++) {
      const reading: SensorReading = {
        id: `SENS-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        value: Math.random() * 100,
        timestamp: now + i
      };
      
      newReadings[i] = reading;
      
      // Batch anomaly detection
      if (reading.value < this.ANOMALY_THRESHOLD_LOW || reading.value > this.ANOMALY_THRESHOLD_HIGH) {
        newAnomalies.push({
          id: reading.id,
          value: reading.value,
          timestamp: reading.timestamp,
          formatted: format(new Date(reading.timestamp), 'MMM dd, HH:mm:ss')
        });
      }
    }
    
    // Efficient array updates with minimal allocations
    const currentReadings = this.allReadings();
    let updatedReadings: SensorReading[];
    
    if (currentReadings.length + batchSize > this.MAX_BUFFER_SIZE) {
      // Calculate how many to remove
      const excess = (currentReadings.length + batchSize) - this.MAX_BUFFER_SIZE;
      // Use slice to create new array more efficiently
      updatedReadings = [...currentReadings.slice(excess), ...newReadings];
    } else {
      updatedReadings = [...currentReadings, ...newReadings];
    }
    
    this.allReadings.set(updatedReadings);
    
    // Batch anomaly updates
    if (newAnomalies.length > 0) {
      const currentAnomalies = this.anomalies();
      this.anomalies.set([...currentAnomalies, ...newAnomalies]);
      
      // Set the last anomaly as latest
      this.latestAnomaly.set(newAnomalies[newAnomalies.length - 1]);
    }
  }

  // Remove unused addAnomaly method since we now batch process anomalies

  dismissAnomaly() {
    this.latestAnomaly.set(null);
  }

  clearData() {
    this.allReadings.set([]);
    this.anomalies.set([]);
    this.latestAnomaly.set(null);
  }
}
