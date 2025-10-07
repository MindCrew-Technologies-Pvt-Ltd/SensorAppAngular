# Real-time Sensor Dashboard

This is an Angular application that serves as a real-time dashboard for monitoring sensor data. It connects to a .NET backend via SignalR to receive live updates and displays the data in various visualizations.

## Overview

The dashboard provides real-time monitoring capabilities with the following features:
- Live time-series chart displaying sensor readings
- Key metrics panel showing statistics
- Anomaly detection and history
- System status monitoring
- Responsive design for all device sizes

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Project Structure

```
src/
├── app/
│   ├── core/           # Core services (data management, SignalR)
│   ├── features/       # Feature modules (home, about)
│   ├── shared/         # Shared components and types
│   ├── app.config.ts   # Application configuration
│   ├── app.routes.ts   # Routing configuration
│   └── app.ts          # Root application component
```

## Key Components

1. **ChartWidget**: Displays live time-series data using Chart.js
2. **MetricsPanel**: Shows key performance indicators
3. **AnomalyHistory**: Lists detected anomalies
4. **SystemStatus**: Displays connection and system status
5. **DashboardHeader**: Provides dashboard controls

## Services

- **Data Service**: Central data management service
- **SignalR Service**: Handles real-time communication with backend

## Data Models

- **SensorReading**: Represents a sensor data point
- **Anomaly**: Represents an anomalous reading
- **MetricData**: Data structure for metrics display
- **StatusItem**: Data structure for status display

## Technologies Used

- Angular 20 with standalone components
- SignalR for real-time communication
- Chart.js for data visualization
- date-fns for date formatting
- TypeScript for type safety

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.