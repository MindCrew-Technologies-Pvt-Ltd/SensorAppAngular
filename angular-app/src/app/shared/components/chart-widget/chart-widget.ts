import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, AfterViewInit, input, effect } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { format } from 'date-fns';
import { SensorReading } from '../../types/dashboard.types';

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

  constructor() {
    // React to data changes
    effect(() => {
      if (this.chart && this.data()) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
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
                return `Value: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
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
    this.updateChart();
  }

  private updateChart() {
    if (!this.chart) return;

    const data = this.data();
    
    this.chart.data.labels = data.map(reading => reading.timestamp);
    this.chart.data.datasets[0].data = data.map(reading => ({
      x: reading.timestamp,
      y: reading.value
    }));
    
    this.chart.update('none');
  }
}