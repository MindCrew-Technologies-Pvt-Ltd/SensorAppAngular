import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { Data } from './core/services/data';

// Shared Components
import { DashboardHeader } from './shared/components/dashboard-header/dashboard-header';
import { ChartWidget } from './shared/components/chart-widget/chart-widget';
import { MetricsPanel } from './shared/components/metrics-panel/metrics-panel';
import { AnomalyHistory } from './shared/components/anomaly-history/anomaly-history';
import { SystemStatus } from './shared/components/system-status/system-status';

// Types
import { MetricData, StatusItem } from './shared/types/dashboard.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeader,
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
  // API URL - replace with your actual Ngrok URL
  private apiUrl = 'https://londyn-preburlesque-bari.ngrok-free.dev'; // Default from the test.html file

  constructor(public data: Data) {}

  ngOnInit() {
    // Initialize the SignalR connection
    this.connectToSignalR();
  }

  ngOnDestroy() {
    // Disconnect when component is destroyed
    this.data.disconnect();
  }

  private connectToSignalR() {
    this.data.initializeConnection(this.apiUrl)
      .then(() => {
        console.log('Connected to SignalR hub');
      })
      .catch(err => {
        console.error('Failed to connect to SignalR hub:', err);
        // Fallback to mock data if connection fails
        this.useMockData();
      });
  }

  private useMockData() {
    console.warn('Using mock data instead of real SignalR connection');
    // In a real implementation, you might want to implement a fallback
    // For now, we'll just log that we're using mock data
  }

  toggleStreaming() {
    if (this.data.isStreaming()) {
      this.data.disconnect();
    } else {
      this.connectToSignalR();
    }
  }

  dismissAnomaly() {
    // This would need to be handled differently with real SignalR
    // For now, we'll just clear the latest anomaly signal
    // In a real implementation, you might want to send a message to the server
  }

  clearData() {
    this.data.clearData();
  }
}