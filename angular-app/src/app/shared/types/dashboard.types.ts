export interface SensorReading {
  id: string;
  value: number;
  timestamp: number;
}

export interface Anomaly {
  id: string;
  value: number;
  timestamp: number;
  formatted: string;
}

export interface MetricData {
  label: string;
  value: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

export interface StatusItem {
  label: string;
  value: string;
  status: 'active' | 'inactive' | 'info' | 'warning';
}