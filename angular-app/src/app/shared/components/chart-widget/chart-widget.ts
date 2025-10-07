import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, AfterViewInit, input, effect, untracked } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { format } from 'date-fns';
import { SensorReading } from '../../types/dashboard.types';
import 'chartjs-adapter-date-fns'; // <-- Add for time scale support

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-widget.html',
  styleUrl: './chart-widget.css'
})
export class ChartWidget implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  title = input<string>('Live Time-Series Chart');
  data = input<SensorReading[]>([]);
  
  private chart: Chart | null = null;
  private updateDebouncer: number | null = null;
  private previousDataHash = '';

  constructor() {
    // Using setInterval as a more reliable way to check for data changes
    // since Angular's effect is not triggering consistently
    setInterval(() => {
      if (this.chart) {
        const inputData = this.data();
        const currentHash = this.calculateDataHash(inputData);
        
        // Check if data actually changed by comparing hash
        if (currentHash !== this.previousDataHash) {
          this.previousDataHash = currentHash;
          this.scheduleChartUpdate(inputData);
        }
      }
    }, 100); // Check for updates every 100ms
  }

  // Calculate a simple hash of the data to detect changes
  private calculateDataHash(data: SensorReading[]): string {
    if (data.length === 0) return 'empty';
    
    // For performance, only consider the last 10 data points for hash calculation
    const samplePoints = data.length > 10 ? data.slice(-10) : data;
    return samplePoints.map(r => r.id + r.timestamp + r.value).join('|');
  }

  private scheduleChartUpdate(chartData: SensorReading[]) {
    if (this.updateDebouncer) {
      cancelAnimationFrame(this.updateDebouncer);
    }
    
    this.updateDebouncer = requestAnimationFrame(() => {
      this.updateChart(chartData);
      this.updateDebouncer = null;
    });
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    // Clean up debouncer
    if (this.updateDebouncer) {
      cancelAnimationFrame(this.updateDebouncer);
      this.updateDebouncer = null;
    }
    
    // Destroy chart
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private initChart() {
    if (!this.chartCanvas?.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Sensor Values',
          data: [],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const date = format(new Date(context.parsed.x), 'yyyy-MM-dd HH:mm:ss');
                return `Date: ${date}, Value: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
              displayFormats: {
                minute: 'HH:mm',
                hour: 'HH:mm',
                second: 'HH:mm:ss'
              }
            },
            position: 'bottom',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white',
              callback: function(value: any) {
                return format(new Date(value), 'HH:mm:ss');
              }
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          }
        },
        animation: {
          duration: 0
        },
        elements: {
          line: {
            tension: 0.1
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(chartData: SensorReading[]) {
    if (!this.chart) return;
    

    // Only keep the latest N points for live streaming effect (optional)
    const maxPoints = 100;
    const trimmedData = chartData.length > maxPoints ? chartData.slice(chartData.length - maxPoints) : chartData;
    
    this.chart.data.labels = trimmedData.map(reading => reading.timestamp);
    // For Chart.js time series with time scale, provide data as [x, y] tuples where x is timestamp
    this.chart.data.datasets[0].data = trimmedData.map(reading => {
      // Convert timestamp to milliseconds since epoch
      let xValue: number;
      
      if (typeof reading.timestamp === 'string') {
        // Parse ISO date string to timestamp
        xValue = new Date(reading.timestamp).getTime();
      } else if (typeof reading.timestamp === 'number') {
        // Assume it's already a timestamp in milliseconds
        xValue = reading.timestamp;
      } else {
        // Fallback to current time
        xValue = Date.now();
      }
      
      // Return as [x, y] tuple which is compatible with Chart.js time series
      return [xValue, reading.value] as [number, number];
    });
    
    this.chart.update('none');
  }
}