import { Injectable, signal, Signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, IHttpConnectionOptions } from '@microsoft/signalr';
import { SensorReading, Anomaly } from '../../shared/types/dashboard.types';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private isConnected = false;
  private apiUrl: string | null = null; // Store the API URL for reconnection

  // Signals for reactive data
  private readings = signal<SensorReading[]>([]);
  private anomalies = signal<Anomaly[]>([]);
  private latestAnomaly = signal<Anomaly | null>(null);
  private isStreaming = signal<boolean>(false);

  // Public signals for components to subscribe to
  public readings$: Signal<SensorReading[]> = this.readings.asReadonly();
  public anomalies$: Signal<Anomaly[]> = this.anomalies.asReadonly();
  public latestAnomaly$: Signal<Anomaly | null> = this.latestAnomaly.asReadonly();
  public isStreaming$: Signal<boolean> = this.isStreaming.asReadonly();

  // Configuration
  private readonly MAX_BUFFER_SIZE = 100000;
  private readonly ANOMALY_THRESHOLD_LOW = 10;
  private readonly ANOMALY_THRESHOLD_HIGH = 90;

  constructor() {}

  /**
   * Initialize the SignalR connection
   * @param apiUrl The base URL of the API (e.g., 'https://your-ngrok-url.ngrok-free.app')
   */
  public initializeConnection(apiUrl: string): Promise<void> {
    // Store the API URL for potential reconnection
    this.apiUrl = apiUrl;
    
    return new Promise((resolve, reject) => {
      try {
        // Configure HTTP connection options with headers to fix CORS issues
        const options: IHttpConnectionOptions = {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          },
        //   withCredentials: true
        };

        // Build the Hub Connection
        this.hubConnection = new HubConnectionBuilder()
          .withUrl(`${apiUrl}/sensorhub`, options)
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        // Define Listeners
        this.setupEventListeners();

        // Start the Connection
        this.hubConnection
          .start()
          .then(() => {
            this.isConnected = true;
            this.isStreaming.set(true);
            console.log('SignalR Connected');
            resolve();
          })
          .catch(err => {
            console.error('SignalR Connection Error:', err);
            this.isConnected = false;
            this.isStreaming.set(false);
            reject(err);
          });
      } catch (error) {
        console.error('SignalR Initialization Error:', error);
        reject(error);
      }
    });
  }

  /**
   * Setup event listeners for SignalR events
   */
  private setupEventListeners() {
    if (!this.hubConnection) return;

    // Listen for sensor readings
    this.hubConnection.on('ReceiveReading', (reading: SensorReading) => {
      // Add the new reading to our buffer

      const currentReadings = this.readings();
      let updatedReadings: SensorReading[];

      if (currentReadings.length >= this.MAX_BUFFER_SIZE) {
        // Remove oldest readings to maintain buffer size
        updatedReadings = [...currentReadings.slice(1), reading];
      } else {
        updatedReadings = [...currentReadings, reading];
      }
      this.readings.set(updatedReadings);

      // Check for anomalies
      if (reading.value < this.ANOMALY_THRESHOLD_LOW || reading.value > this.ANOMALY_THRESHOLD_HIGH) {
        const anomaly: Anomaly = {
          id: reading.id,
          value: reading.value,
          timestamp: reading.timestamp,
          formatted: format(new Date(reading.timestamp), 'MMM dd, HH:mm:ss')
        };

        const currentAnomalies = this.anomalies();
        this.anomalies.set([...currentAnomalies, anomaly]);
        this.latestAnomaly.set(anomaly);
      }
    });

    // Listen for alerts
    this.hubConnection.on('ReceiveAlert', (anomaly: Anomaly) => {
      const currentAnomalies = this.anomalies();
      this.anomalies.set([...currentAnomalies, anomaly]);
      this.latestAnomaly.set(anomaly);
    });

    // Handle connection events
    this.hubConnection.onreconnected(() => {
      console.log('SignalR Reconnected');
      this.isConnected = true;
      this.isStreaming.set(true);
    });

    this.hubConnection.onreconnecting(() => {
      console.log('SignalR Reconnecting...');
      this.isConnected = false;
      this.isStreaming.set(false);
    });

    this.hubConnection.onclose((error?: Error) => {
      this.isConnected = false;
      this.isStreaming.set(false);
      
      // Attempt to reconnect automatically if we have a stored API URL
      if (error && this.apiUrl) {
        setTimeout(() => {
          if (!this.isConnected && this.apiUrl) {
            this.initializeConnection(this.apiUrl);
          }
        }, 5000);
      }
    });
  }

  /**
   * Stop the SignalR connection
   */
  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.hubConnection && this.isConnected) {
        this.hubConnection
          .stop()
          .then(() => {
            this.isConnected = false;
            this.isStreaming.set(false);
            console.log('SignalR Disconnected');
            resolve();
          })
          .catch(err => {
            console.error('SignalR Disconnection Error:', err);
            reject(err);
          });
      } else {
        resolve();
      }
    });
  }

  /**
   * Clear all data
   */
  public clearData(): void {
    this.readings.set([]);
    this.anomalies.set([]);
    this.latestAnomaly.set(null);
  }

  /**
   * Get the connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}