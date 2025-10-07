# Angular .NET Real-time Dashboard

A modern real-time monitoring dashboard built with Angular that connects to a .NET backend via SignalR for live sensor data streaming.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Components](#components)
- [Services](#services)
- [Data Models](#data-models)
- [Technologies](#technologies)
- [Deployment](#deployment)

## Overview

This Angular application serves as a real-time dashboard for monitoring sensor data. It connects to a .NET backend via SignalR to receive live updates and displays the data in various visualizations including time-series charts, metrics panels, and anomaly detection alerts.

## Features

- **Real-time Data Streaming**: Connects to a .NET backend via SignalR for live sensor data
- **Interactive Dashboard**: Modern UI with multiple visualization components
- **Live Time-series Chart**: Real-time chart displaying the last 300 sensor readings
- **Metrics Panel**: Key performance indicators including total readings, live average, and min/max values
- **Anomaly Detection**: Automatic detection and display of anomalous readings
- **System Status Monitoring**: Real-time connection and system status information
- **Responsive Design**: Works on desktop and mobile devices
- **Automatic Reconnection**: Handles network interruptions gracefully
- **Data Buffering**: Maintains up to 100,000 readings in memory
- **Mock Data Fallback**: Provides fallback mechanism when real data is unavailable

## Architecture

The application follows a modern Angular architecture with:

- **Standalone Components**: Uses Angular's latest standalone component architecture
- **Signals**: Leverages Angular Signals for reactive state management
- **Service Layer**: Centralized data management through injectable services
- **Modular Structure**: Organized into Core, Shared, and Features modules
- **Type Safety**: Strong typing throughout with TypeScript interfaces

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Angular CLI (installed globally)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the angular-app directory:
   ```bash
   cd angular-dotnet-fe/angular-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify any source files.

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools:

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# View all available schematics
ng generate --help
```

## Building for Production

To build the project for production:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. The production build optimizes your application for performance and speed.

## Project Structure

```
angular-app/
├── src/
│   ├── app/
│   │   ├── core/           # Core services and application-wide utilities
│   │   ├── features/       # Feature modules (home, about, etc.)
│   │   ├── shared/         # Shared components, types, and utilities
│   │   ├── app.config.ts   # Application configuration
│   │   ├── app.routes.ts   # Application routing
│   │   └── app.ts          # Root application component
│   ├── assets/             # Static assets
│   └── index.html          # Main HTML file
├── package.json            # Project dependencies and scripts
└── angular.json            # Angular CLI configuration
```

## Components

### Dashboard Components

1. **ChartWidget** (`shared/components/chart-widget`)
   - Displays live time-series data in a responsive chart
   - Uses Chart.js with date-fns adapter for time formatting
   - Shows the last 300 data points with smooth animations

2. **MetricsPanel** (`shared/components/metrics-panel`)
   - Displays key performance metrics in a card-based layout
   - Shows total readings, live average, and min/max values

3. **AnomalyHistory** (`shared/components/anomaly-history`)
   - Lists recent anomalous readings
   - Highlights values outside the normal range (10-90)

4. **SystemStatus** (`shared/components/system-status`)
   - Displays system connection and performance status
   - Shows streaming status, data rate, and buffer information

5. **DashboardHeader** (`shared/components/dashboard-header`)
   - Provides controls for toggling data streaming and clearing data
   - Shows application title and navigation

### Layout Components

1. **Header** (`shared/components/header`)
   - Application navigation bar
   - Responsive design for mobile devices

2. **Footer** (`shared/components/footer`)
   - Application footer with copyright information

## Services

### Data Service (`core/services/data.ts`)

The central data service that manages all application state:

- **SignalR Integration**: Manages the SignalR connection to the backend
- **State Management**: Uses Angular Signals for reactive state updates
- **Computed Properties**: Derives metrics and statistics from raw data
- **Data Buffering**: Maintains a buffer of up to 100,000 readings
- **Performance Optimization**: Implements caching for expensive computations

### SignalR Service (`core/services/signalr.service.ts`)

Handles the SignalR connection and data streaming:

- **Connection Management**: Establishes and maintains SignalR connection
- **Automatic Reconnection**: Handles network interruptions gracefully
- **Event Handling**: Processes incoming sensor readings and alerts
- **Anomaly Detection**: Automatically detects and flags anomalous readings
- **Data Validation**: Ensures data integrity and proper formatting

## Data Models

### SensorReading

```typescript
interface SensorReading {
  readonly id: string;
  readonly value: number;
  readonly timestamp: number;
}
```

### Anomaly

```typescript
interface Anomaly {
  readonly id: string;
  readonly value: number;
  readonly timestamp: number;
  readonly formatted: string;
}
```

### MetricData

```typescript
interface MetricData {
  readonly label: string;
  readonly value: string;
  readonly color: 'blue' | 'green' | 'orange' | 'purple';
}
```

### StatusItem

```typescript
interface StatusItem {
  readonly label: string;
  readonly value: string;
  readonly status: 'active' | 'inactive' | 'info' | 'warning';
}
```

## Technologies

- **Angular 20**: Latest version with standalone components
- **TypeScript**: Strongly typed JavaScript superset
- **SignalR**: Real-time communication with .NET backend
- **Chart.js**: Data visualization library
- **date-fns**: Modern JavaScript date utility library
- **RxJS**: Reactive programming library (for compatibility)
- **CSS3**: Modern styling with responsive design

## Testing

### Running Unit Tests

Execute unit tests with the Karma test runner:

```bash
ng test
```

### Running End-to-End Tests

For end-to-end testing:

```bash
ng e2e
```

Note: You'll need to set up an e2e testing framework separately as Angular CLI doesn't include one by default.

## Deployment

To deploy the application:

1. Build for production:
   ```bash
   ng build --prod
   ```

2. Deploy the contents of the `dist/` folder to your web server.

### Environment Configuration

Update the API URL in `app.ts` to point to your deployed .NET backend:

```typescript
private apiUrl = 'https://your-ngrok-url.ngrok-free.dev';
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: The application includes headers to handle CORS issues with ngrok:
   ```typescript
   headers: {
     'ngrok-skip-browser-warning': 'true'
   }
   ```

2. **Connection Failures**: The application will automatically fall back to mock data if the SignalR connection fails.

3. **Performance Issues**: The application implements several optimizations:
   - Data buffering with maximum size limits
   - Computed property caching
   - Efficient change detection with OnPush strategy
   - Debounced chart updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/introduction)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [date-fns Documentation](https://date-fns.org/)