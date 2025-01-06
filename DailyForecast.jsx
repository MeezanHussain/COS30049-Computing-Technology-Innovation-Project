import React, { useState, useEffect, useRef } from 'react';
import { Card, Spinner, Button } from 'flowbite-react';
import Plot from 'react-plotly.js';
import { Sun, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import HeroSection from './HeroSection';
import axios from 'axios';
import html2canvas from 'html2canvas';

function DailyForecast() {
  const [dailyData, setDailyData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 0, 1));  // Default date is January 1, 2024
  const [isLoading, setIsLoading] = useState(false);  // Loading state for data fetch
  const [error, setError] = useState(null);  // Error state for handling fetch errors

  // Refs for exporting charts as images
  const temperatureChartRef = useRef(null);
  const humidityChartRef = useRef(null);

  useEffect(() => {
    const fetchDailyData = async () => {
      if (!selectedDate) return;

      setIsLoading(true);  // Start loading
      setError(null);  // Clear any previous errors

      try {
        const formattedDate = format(selectedDate, 'dd-MM');  // Format selected date for API request

        // Fetch predictions for temperature and humidity (both regression and classification)
        const [tempResponse, humidityResponse, tempClassResponse, humidityClassResponse] = await Promise.all([
          axios.post("http://localhost:8000/prediction/temperature-regression/day-hourly", { date: formattedDate }),
          axios.post("http://localhost:8000/prediction/humidity-regression/day-hourly", { date: formattedDate }),
          axios.post("http://localhost:8000/prediction/temperature-classification/day-hourly", { date: formattedDate }),
          axios.post("http://localhost:8000/prediction/humidity-classification/day-hourly", { date: formattedDate })
        ]);

        // Extract data from responses
        const tempData = tempResponse.data;
        const humidityData = humidityResponse.data;
        const tempClassData = tempClassResponse.data;
        const humidityClassData = humidityClassResponse.data;

        // Combine temperature and humidity data with their classifications
        const combinedData = tempData['Predictions'].map((temp, index) => ({
          hour: temp.hour,
          temperature: parseFloat(temp['Prediction']),
          humidity: parseFloat(humidityData['Predictions'][index]['Prediction']),
          temperatureClass: tempClassData['Predictions'][index]['Prediction'],
          humidityClass: humidityClassData['Predictions'][index]['Prediction']
        }));

        setDailyData(combinedData);  // Update state with the combined data
      } catch (err) {
        console.error('Error fetching daily data:', err);
        setError(err.message + ". Please make sure the backend is up and running.");
      } finally {
        setIsLoading(false);  // Stop loading
      }
    };

    fetchDailyData();  // Fetch data whenever selectedDate changes
  }, [selectedDate]);

  // Export data as CSV
  const exportToCSV = () => {
    if (!dailyData) return;

    const headers = ['Hour', 'Temperature (°C)', 'Humidity (%)', 'Temperature Classification', 'Humidity Classification'];
    const csvData = [
      headers.join(','),
      ...dailyData.map(row => [
        row.hour,
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
    a.download = `daily-data-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Export data as JSON
  const exportToJSON = () => {
    if (!dailyData) return;

    const exportData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      hourlyData: dailyData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-data-${format(selectedDate, 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Export chart as an image
  const exportChartAsImage = (chartRef, filename) => {
    if (!chartRef.current) return;

    html2canvas(chartRef.current, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}-${format(selectedDate, 'yyyy-MM-dd')}.png`;
      link.click();
    });
  };

  // Layout configuration for Plotly charts
  const getChartLayout = (title) => ({
    title: { text: title, font: { family: 'system-ui', size: 20 } },
    height: 400,
    margin: { t: 60, r: 40, l: 60, b: 60 },
    xaxis: { title: 'Hour', gridcolor: 'rgba(0,0,0,0.1)', zeroline: false },
    yaxis: { title: title.includes('Temperature') ? 'Temperature (°C)' : 'Humidity (%)', gridcolor: 'rgba(0,0,0,0.1)', zeroline: false },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'x unified',
    showlegend: true
  });

  return (
    <div>
      {/* Section header */}
      <HeroSection title="Daily Forecasts" description="Explore daily weather forecasts with hourly predictions." />

      <div className="container mx-auto p-6">
        {/* Date selection card */}
        <Card className="flex flex-col items-center justify-center mb-6">
          <h3 className="text-xl font-bold mb-4">Select Date</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            defaultMonth={new Date(2024, 0, 1)}
            disabled={(date) => date < new Date(2024, 0, 1) || date > new Date(2024, 8, 22)}
            className="border rounded p-2"
          />

          {selectedDate && (
            <div className="mt-4 text-center text-gray-600">
              Selected: {format(selectedDate, 'MMMM d, yyyy')}
            </div>
          )}
        </Card>

        {/* Display loading, error, or data */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <Card>
            <div className="text-red-500 p-4">{error}</div>
          </Card>
        ) : dailyData ? (
          <>
            {/* Table displaying hourly data */}
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border-b">Hour</th>
                    <th className="px-4 py-2 border-b">Predicted Temperature (°C)</th>
                    <th className="px-4 py-2 border-b">Predicted Temperature Level</th>
                    <th className="px-4 py-2 border-b">Predicted Humidity (%)</th>
                    <th className="px-4 py-2 border-b">Predicted Humidity Level</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((item, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{`${item.hour}:00`}</td>
                      <td className="px-4 py-2 border-b">{item.temperature.toFixed(1)}°C</td>
                      <td className="px-4 py-2 border-b">{item.temperatureClass.charAt(0).toUpperCase() + item.temperatureClass.slice(1)}</td>
                      <td className="px-4 py-2 border-b">{item.humidity.toFixed(1)}%</td>
                      <td className="px-4 py-2 border-b">{item.humidityClass.charAt(0).toUpperCase() + item.humidityClass.slice(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export buttons for CSV and JSON */}
            <div className="flex gap-2 mb-6">
              <Button color="gray" className="px-4 py-2" onClick={exportToCSV}>Export Data as CSV</Button>
              <Button color="gray" className="px-4 py-2" onClick={exportToJSON}>Export Data as JSON</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Temperature Chart */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-xl font-bold">Hourly Temperature</h3>
                  </div>
                  <Button color="gray" onClick={() => exportChartAsImage(temperatureChartRef, 'temperature-chart')}>
                    Export as Image
                  </Button>
                </div>
                <div ref={temperatureChartRef} className="h-[400px]">
                  <Plot
                    data={[
                      {
                        x: dailyData.map(d => `${d.hour}:00`),
                        y: dailyData.map(d => d.temperature),
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Temperature',
                        line: { color: '#2A9D8F', width: 3 },
                        marker: { color: '#2A9D8F', size: 8 },
                        fill: 'tozeroy',
                        fillcolor: 'rgba(42, 157, 143, 0.1)'
                      }
                    ]}
                    layout={getChartLayout('Temperature Forecast')}
                    config={{ responsive: true, displayModeBar: true, modeBarButtonsToRemove: ['lasso2d', 'select2d'], displaylogo: false }}
                    className="w-full"
                  />
                </div>
              </Card>

              {/* Humidity Chart */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Hourly Humidity</h3>
                  </div>
                  <Button color="gray" onClick={() => exportChartAsImage(humidityChartRef, 'humidity-chart')}>
                    Export as Image
                  </Button>
                </div>
                <div ref={humidityChartRef} className="h-[400px]">
                  <Plot
                    data={[
                      {
                        x: dailyData.map(d => `${d.hour}:00`),
                        y: dailyData.map(d => d.humidity),
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Humidity',
                        line: { color: '#264653', width: 3 },
                        marker: { color: '#264653', size: 8 },
                        fill: 'tozeroy',
                        fillcolor: 'rgba(38, 70, 83, 0.1)'
                      }
                    ]}
                    layout={getChartLayout('Humidity Forecast')}
                    config={{ responsive: true, displayModeBar: true, modeBarButtonsToRemove: ['lasso2d', 'select2d'], displaylogo: false }}
                    className="w-full"
                  />
                </div>
              </Card>
            </div>

            {/* Daily Statistics Summary */}
            <Card>
              <h3 className="text-xl font-bold mb-4">Daily Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Temperature Stats */}
                <div>
                  <h4 className="font-semibold text-primary mb-2">Temperature</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>Maximum: {Math.max(...dailyData.map(d => d.temperature)).toFixed(1)}°C</li>
                    <li>Minimum: {Math.min(...dailyData.map(d => d.temperature)).toFixed(1)}°C</li>
                    <li>Average: {(dailyData.reduce((acc, d) => acc + d.temperature, 0) / dailyData.length).toFixed(1)}°C</li>
                    <li>Range: {(Math.max(...dailyData.map(d => d.temperature)) - Math.min(...dailyData.map(d => d.temperature))).toFixed(1)}°C</li>
                  </ul>
                </div>
                {/* Humidity Stats */}
                <div>
                  <h4 className="font-semibold text-secondary mb-2">Humidity</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>Maximum: {Math.max(...dailyData.map(d => d.humidity)).toFixed(1)}%</li>
                    <li>Minimum: {Math.min(...dailyData.map(d => d.humidity)).toFixed(1)}%</li>
                    <li>Average: {(dailyData.reduce((acc, d) => acc + d.humidity, 0) / dailyData.length).toFixed(1)}%</li>
                    <li>Range: {(Math.max(...dailyData.map(d => d.humidity)) - Math.min(...dailyData.map(d => d.humidity))).toFixed(1)}%</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card>
            <p className="text-center text-gray-500">Select a date to view forecast</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DailyForecast;
