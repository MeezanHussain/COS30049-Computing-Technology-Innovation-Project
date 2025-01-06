import React, { useState, useEffect, useRef } from 'react';
import { Card, Spinner, Button } from 'flowbite-react';
import { Sun, Droplets } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import StyledButton from './ui/StyledButton';
import HeroSection from './HeroSection';
import axios from "axios";
import html2canvas from 'html2canvas';

// Register ChartJS components for chart rendering
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function MonthlyForecast() {
  // State management for monthly data, selected month, loading, error, and invalid month state
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInvalidMonth, setIsInvalidMonth] = useState(false);

  // Refs for capturing chart elements for export
  const temperatureChartRef = useRef(null);
  const humidityChartRef = useRef(null);

  // Array of month names to display and select
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    // Display error if a month after September is selected
    if (selectedMonth > 9) {
      setIsInvalidMonth(true);
      setMonthlyData(null);
      return;
    }

    setIsInvalidMonth(false);
    // Fetches monthly data when a valid month is selected
    const fetchMonthlyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Request data from four endpoints in parallel for temperature and humidity, regression and classification
        const [tempResponse, humidityResponse, tempClassResponse, humidityClassResponse] = await Promise.all([
          axios.post("http://localhost:8000/prediction/temperature-regression/monthly", { month: selectedMonth }),
          axios.post("http://localhost:8000/prediction/humidity-regression/monthly", { month: selectedMonth }),
          axios.post("http://localhost:8000/prediction/temperature-classification/monthly", { month: selectedMonth }),
          axios.post("http://localhost:8000/prediction/humidity-classification/monthly", { month: selectedMonth })
        ]);

        // Extract and combine data from the API responses
        const tempData = tempResponse.data;
        const humidityData = humidityResponse.data;
        const tempClassData = tempClassResponse.data;
        const humidityClassData = humidityClassResponse.data;

        // Combine data from responses into a single data structure
        const combinedData = tempData['Predictions'].map((temp, index) => ({
          day: temp.Date,
          temperature: parseFloat(temp['Prediction']),
          humidity: parseFloat(humidityData['Predictions'][index]['Prediction']),
          temperatureClass: tempClassData['Predictions'][index]['Prediction'],
          humidityClass: humidityClassData['Predictions'][index]['Prediction']
        }));

        setMonthlyData(combinedData);
      } catch (err) {
        console.error('Error fetching monthly data:', err);
        setError(err.message + ". Please make sure the backend is up and running" || 'Failed to fetch data. Please make sure the backend is up and running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedMonth]);

  // Export data to CSV format
  const exportToCSV = () => {
    if (!monthlyData) return;

    const headers = ['Day', 'Temperature (°C)', 'Humidity (%)', 'Temperature Classification', 'Humidity Classification'];
    const csvData = [
      headers.join(','),
      ...monthlyData.map(row => [
        row.day,
        row.temperature.toFixed(1),
        row.humidity.toFixed(1),
        row.temperatureClass,
        row.humidityClass
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-data-${monthNames[selectedMonth - 1]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Export data to JSON format
  const exportToJSON = () => {
    if (!monthlyData) return;

    const exportData = {
      month: monthNames[selectedMonth - 1],
      dailyData: monthlyData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-data-${monthNames[selectedMonth - 1]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Export chart as an image using html2canvas
  const exportChartAsImage = (chartRef, filename) => {
    if (!chartRef.current) return;

    html2canvas(chartRef.current, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}-${monthNames[selectedMonth - 1]}.png`;
      link.click();
    });
  };

  // Temperature chart configuration
  const temperatureChartData = {
    labels: monthlyData?.map(item => `Day ${item.day}`) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: monthlyData?.map(item => item.temperature) || [],
        borderColor: '#2A9D8F',
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Humidity chart configuration
  const humidityChartData = {
    labels: monthlyData?.map(item => `Day ${item.day}`) || [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: monthlyData?.map(item => item.humidity) || [],
        borderColor: '#264653',
        backgroundColor: 'rgba(38, 70, 83, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  // Shared chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false }, title: { display: true, text: 'Day of Month' } },
      y: { beginAtZero: false, grid: { color: 'rgba(0, 0, 0, 0.1)' }, title: { display: true, text: 'Value' } }
    },
    interaction: { intersect: false, mode: 'index' }
  };

  return (
    <div>
      {/* Header section with title and description */}
      <HeroSection
        title="Monthly Forecasts"
        description="Explore month-long weather trends predicted by AI-ML models."
      />
      <div className="container mx-auto p-6">
        {/* Month Selection Buttons */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2">
            {monthNames.map((month, index) => (
              <StyledButton
                key={month}
                color={selectedMonth === index + 1 ? "primary" : "gray"} // Highlight selected month
                onClick={() => setSelectedMonth(index + 1)}
                disabled={isLoading}
              >
                {month}
              </StyledButton>
            ))}
          </div>
        </Card>

        {/* Display message if an unsupported month is selected */}
        {isInvalidMonth ? (
          <Card>
            <div className="text-center text-red-500 p-4">
              Currently our AI Models are only able to predict temperature and humidity trends from January to September. Please select a month between January and September to view the predictions.
            </div>
          </Card>
        ) : isLoading ? (
          // Loading spinner
          <div className="flex justify-center p-8">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          // Display error message if data fetch fails
          <Card>
            <div className="text-red-500 p-4">{error}</div>
          </Card>
        ) : monthlyData ? (
          <>
            {/* Data Table for Temperature and Humidity */}
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Predicted Temperature (°C)</th>
                    <th className="px-4 py-2 border-b">Predicted Temperature Level</th>
                    <th className="px-4 py-2 border-b">Predicted Humidity (%)</th>
                    <th className="px-4 py-2 border-b">Predicted Humidity Level</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="px-4 py-2 border-b">Day {item.day}</td>
                      <td className="px-4 py-2 border-b">{item.temperature.toFixed(1)}°C</td>
                      <td className="px-4 py-2 border-b">{item.temperatureClass.charAt(0).toUpperCase() + item.temperatureClass.slice(1)}</td>
                      <td className="px-4 py-2 border-b">{item.humidity.toFixed(1)}%</td>
                      <td className="px-4 py-2 border-b">{item.humidityClass.charAt(0).toUpperCase() + item.humidityClass.slice(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2 mb-6">
              <Button color="gray" onClick={exportToCSV}>
                Export Data as CSV
              </Button>
              <Button color="gray" onClick={exportToJSON}>
                Export Data as JSON
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Temperature Chart */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-xl font-bold">Temperature Trends</h3>
                  </div>
                  <Button color="gray" onClick={() => exportChartAsImage(temperatureChartRef, 'temperature-chart')}>
                    Export as Image
                  </Button>
                </div>
                <div ref={temperatureChartRef} className="h-[400px]">
                  <Line data={temperatureChartData} options={chartOptions} />
                </div>
              </Card>

              {/* Humidity Chart */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Humidity Trends</h3>
                  </div>
                  <Button color="gray" onClick={() => exportChartAsImage(humidityChartRef, 'humidity-chart')}>
                    Export as Image
                  </Button>
                </div>
                <div ref={humidityChartRef} className="h-[400px]">
                  <Line data={humidityChartData} options={chartOptions} />
                </div>
              </Card>
            </div>

            {/* Monthly Summary with statistics */}
            <Card className="mt-6">
              <h3 className="text-xl font-bold mb-4">Monthly Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Temperature</h4>
                  <ul className="space-y-2">
                    <li>Average: {(monthlyData.reduce((sum, item) => sum + item.temperature, 0) / monthlyData.length).toFixed(1)}°C</li>
                    <li>Maximum: {Math.max(...monthlyData.map(item => item.temperature)).toFixed(1)}°C</li>
                    <li>Minimum: {Math.min(...monthlyData.map(item => item.temperature)).toFixed(1)}°C</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Humidity</h4>
                  <ul className="space-y-2">
                    <li>Average: {(monthlyData.reduce((sum, item) => sum + item.humidity, 0) / monthlyData.length).toFixed(1)}%</li>
                    <li>Maximum: {Math.max(...monthlyData.map(item => item.humidity)).toFixed(1)}%</li>
                    <li>Minimum: {Math.min(...monthlyData.map(item => item.humidity)).toFixed(1)}%</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card>
            <p className="text-center text-gray-500">No data available</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MonthlyForecast;
