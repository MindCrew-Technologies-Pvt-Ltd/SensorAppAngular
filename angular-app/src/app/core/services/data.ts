import { Injectable } from '@angular/core';
import { SignalRService } from './signalr.service';
import { SensorReading, Anomaly, MetricData, StatusItem } from '../../shared/types/dashboard.types';
import { Signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Data {
  constructor(private signalRService: SignalRService) {}

  // Expose SignalR data as computed properties for use in components
  public readings = computed(() => this.signalRService.readings$());
  public anomalies = computed(() => this.signalRService.anomalies$());
  public latestAnomaly = computed(() => this.signalRService.latestAnomaly$());
  public isStreaming = computed(() => this.signalRService.isStreaming$());

  // Methods to control the data flow
  public initializeConnection(apiUrl: string): Promise<void> {
    return this.signalRService.initializeConnection(apiUrl);
  }

  public disconnect(): Promise<void> {
    return this.signalRService.disconnect();
  }

  public clearData(): void {
    this.signalRService.clearData();
  }

  // Computed properties for derived data (similar to what was in the App component)
  public chartData = computed(() => {
    const readings = this.readings();
    const result = readings.slice(-300); // Last 300 points for the chart
    return result;
  });

  public recentAnomalies = computed(() => {
    return this.anomalies().slice(-5).reverse();
  });

  public totalCount = computed(() => this.readings().length);

  // Statistics computations
  private readonly _statsCache = {
    readings: null as SensorReading[] | null,
    max: 0,
    min: 0,
    sum: 0
  };

  private computeStats = computed(() => {
    const readings = this.readings();
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

  public liveAverage = computed(() => {
    const readings = this.readings();
    if (readings.length === 0) return '0.00';
    
    const last100 = readings.length > 100 ? readings.slice(-100) : readings;
    const sum = last100.reduce((acc, reading) => acc + reading.value, 0);
    return (sum / last100.length).toFixed(2);
  });

  public maxValue = computed(() => {
    const stats = this.computeStats();
    return stats.max.toFixed(2);
  });

  public minValue = computed(() => {
    const stats = this.computeStats();
    return stats.min.toFixed(2);
  });

  // Computed properties for component data
  public keyMetrics = computed((): MetricData[] => [
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

  public systemStatusItems = computed((): StatusItem[] => [
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
}