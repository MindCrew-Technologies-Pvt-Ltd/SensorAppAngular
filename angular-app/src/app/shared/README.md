# Dashboard Components

This directory contains reusable components for the Real-Time Analytics Dashboard.

## Components

### Core Components

#### 1. DashboardHeader
- **Purpose**: Main header with title and control buttons
- **Inputs**: 
  - `title: string` - Dashboard title (default: "Real-Time Sensor Analytics Dashboard")
  - `isStreaming: boolean` - Current streaming state
- **Outputs**: 
  - `toggleStreaming()` - Emitted when streaming button is clicked
  - `clearData()` - Emitted when clear data button is clicked

#### 2. AnomalyAlert
- **Purpose**: Dismissible alert banner for anomaly notifications
- **Inputs**: 
  - `anomaly: Anomaly | null` - Current anomaly to display
- **Outputs**: 
  - `dismiss()` - Emitted when user dismisses the alert

#### 3. ChartWidget
- **Purpose**: Real-time line chart display using Chart.js
- **Inputs**: 
  - `title: string` - Chart title (default: "Live Time-Series Chart")
  - `data: SensorReading[]` - Array of sensor readings to display
- **Features**: 
  - Automatic chart updates via Angular effects
  - Responsive design
  - Dark theme styling

#### 4. MetricsPanel
- **Purpose**: Display key performance metrics in cards
- **Inputs**: 
  - `title: string` - Panel title (default: "Key Metrics")
  - `metrics: MetricData[]` - Array of metrics to display
- **Features**: Color-coded metric values

#### 5. AnomalyHistory
- **Purpose**: List of recent anomalies
- **Inputs**: 
  - `title: string` - Panel title (default: "Recent Anomalies")
  - `anomalies: Anomaly[]` - Array of recent anomalies
  - `emptyMessage: string` - Message when no anomalies (default: "No anomalies detected")

#### 6. SystemStatus
- **Purpose**: Display system status information
- **Inputs**: 
  - `title: string` - Panel title (default: "System Status")
  - `statusItems: StatusItem[]` - Array of status items to display

## Types

### SensorReading
```typescript
interface SensorReading {
  id: string;        // Sensor identifier
  value: number;     // Sensor reading value
  timestamp: number; // Unix timestamp
}
```

### Anomaly
```typescript
interface Anomaly {
  id: string;        // Sensor identifier
  value: number;     // Anomalous value
  timestamp: number; // Unix timestamp
  formatted: string; // Human-readable timestamp
}
```

### MetricData
```typescript
interface MetricData {
  label: string;     // Metric description
  value: string;     // Metric value (formatted)
  color: 'blue' | 'green' | 'orange' | 'purple'; // Color theme
}
```

### StatusItem
```typescript
interface StatusItem {
  label: string;     // Status label
  value: string;     // Status value
  status: 'active' | 'inactive' | 'info' | 'warning'; // Status type
}
```

## Usage Examples

### Basic Dashboard Layout
```typescript
@Component({
  template: `
    <app-dashboard-header
      [isStreaming]="isStreaming()"
      (toggleStreaming)="toggleStreaming()"
      (clearData)="clearData()"
    />

    <app-anomaly-alert
      [anomaly]="latestAnomaly()"
      (dismiss)="dismissAnomaly()"
    />

    <app-chart-widget
      title="Live Data"
      [data]="chartData()"
    />

    <app-metrics-panel [metrics]="keyMetrics()" />
    <app-anomaly-history [anomalies]="recentAnomalies()" />
    <app-system-status [statusItems]="systemStatus()" />
  `
})
```

### Custom Metric Configuration
```typescript
keyMetrics = computed((): MetricData[] => [
  {
    label: 'Total Readings',
    value: this.totalCount().toString(),
    color: 'blue'
  },
  {
    label: 'Average Value',
    value: this.average().toFixed(2),
    color: 'green'
  }
]);
```

## Design Principles

1. **Reusability**: Each component is self-contained and reusable
2. **Performance**: Uses Angular Signals and OnPush change detection
3. **Type Safety**: Strongly typed interfaces for all data
4. **Responsive**: Mobile-first responsive design
5. **Accessibility**: Semantic HTML and proper ARIA labels
6. **Dark Theme**: Consistent dark theme styling

## Dependencies

- **Angular Signals**: For reactive state management
- **Chart.js**: For chart rendering (ChartWidget only)
- **date-fns**: For date formatting (ChartWidget only)

## File Structure

```
shared/
├── components/
│   ├── dashboard-header/
│   │   ├── dashboard-header.ts
│   │   ├── dashboard-header.html
│   │   └── dashboard-header.css
│   ├── anomaly-alert/
│   │   ├── anomaly-alert.ts
│   │   ├── anomaly-alert.html
│   │   └── anomaly-alert.css
│   ├── chart-widget/
│   │   ├── chart-widget.ts
│   │   ├── chart-widget.html
│   │   └── chart-widget.css
│   ├── metrics-panel/
│   │   ├── metrics-panel.ts
│   │   ├── metrics-panel.html
│   │   └── metrics-panel.css
│   ├── anomaly-history/
│   │   ├── anomaly-history.ts
│   │   ├── anomaly-history.html
│   │   └── anomaly-history.css
│   └── system-status/
│       ├── system-status.ts
│       ├── system-status.html
│       └── system-status.css
├── types/
│   └── dashboard.types.ts
├── index.ts
└── README.md
```

## Future Enhancements

- Add animation transitions
- Implement chart zoom/pan functionality
- Add export capabilities
- Support for multiple chart types
- Customizable color themes
- Accessibility improvements
- SCSS conversion for advanced styling features
- Shared component stylesheets
- CSS custom properties for theming