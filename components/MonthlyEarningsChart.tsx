import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Event, PaymentStatus } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyEarningsChartProps {
  events: Event[];
  theme: string;
}

const MonthlyEarningsChart: React.FC<MonthlyEarningsChartProps> = ({ events, theme }) => {
  const isDarkMode = theme === 'dark';

  const data: ChartData<'bar'> = React.useMemo(() => {
    const labels: string[] = [];
    const earnings: number[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      labels.push(monthLabel);
      
      const monthlyEarnings = events
        .filter(event => {
          const eventDate = new Date(event.eventStartDate);
          return (
            event.paymentStatus === PaymentStatus.Paid &&
            eventDate.getFullYear() === date.getFullYear() &&
            eventDate.getMonth() === date.getMonth()
          );
        })
        .reduce((sum, event) => sum + event.payment, 0);

      earnings.push(monthlyEarnings);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Earnings',
          data: earnings,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
          borderRadius: 4,
        },
      ],
    };
  }, [events]);

  const options: ChartOptions<'bar'> = React.useMemo(() => {
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
            backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
          },
          ticks: {
            color: textColor,
             callback: function(value) {
                if (typeof value === 'number') {
                    if (value >= 1000) return '$' + (value / 1000) + 'k';
                    return '$' + value;
                }
                return value;
            }
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColor,
          },
        },
      },
    };
  }, [isDarkMode]);

  return <Bar options={options} data={data} />;
};

export default MonthlyEarningsChart;
