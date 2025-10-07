export interface SensorReading {
  readonly id: string;
  readonly value: number;
  readonly timestamp: number;
}

export interface Anomaly {
  readonly id: string;
  readonly value: number;
  readonly timestamp: number;
  readonly formatted: string;
}

export interface MetricData {
  readonly label: string;
  readonly value: string;
  readonly color: 'blue' | 'green' | 'orange' | 'purple';
}

export interface StatusItem {
  readonly label: string;
  readonly value: string;
  readonly status: 'active' | 'inactive' | 'info' | 'warning';
}

// Performance constants
export const PERFORMANCE_CONSTANTS = {
  MAX_BUFFER_SIZE: 100000,
  CHART_DISPLAY_SIZE: 300,
  ANOMALY_THRESHOLD_LOW: 10,
  ANOMALY_THRESHOLD_HIGH: 90,
  BATCH_SIZE: 10,
  UPDATE_INTERVAL: 50
} as const;