import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttendanceGraph({ data }) {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Attendance',
        data: data.map(d => (d.status === 'present' ? 1 : 0)),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  return <Bar data={chartData} />;
}
