import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Spinner, Select } from 'flowbite-react';
import { Sun, Droplets, BarChart3 } from 'lucide-react';
import * as d3 from 'd3';
import HeroSection from './HeroSection';
import axios from 'axios';

function DataVisualization() {
  // State to store data, selected month, loading and error states, and active view (heatmap or scatter plot)
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('heatmap');

  // Refs to target heatmap, scatter, and correlation chart containers for D3 rendering
  const heatmapRef = useRef(null);
  const scatterRef = useRef(null);
  const correlationRef = useRef(null);

  // Month names for display in dropdown
  const monthNames = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September'
  ];

  // Fetch data whenever the selected month changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [tempResponse, humidityResponse] = await Promise.all([
          // Fetch temperature and humidity data from the backend
          axios.post("http://localhost:8000/prediction/temperature-regression/monthly", { month: selectedMonth }),
          axios.post("http://localhost:8000/prediction/humidity-regression/monthly", { month: selectedMonth })
        ]);

        const tempData = await tempResponse.data;
        const humidityData = await humidityResponse.data;

        // Combine temperature and humidity data
        const combinedData = tempData['Predictions'].map((temp, index) => ({
          day: temp.Date,
          temperature: parseFloat(temp['Prediction']),
          humidity: parseFloat(humidityData['Predictions'][index]['Prediction'])
        }));

        setData(combinedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message + ". Please make sure the backend is up and running");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  // Render heatmap if data is available and the active view is 'heatmap'
  useEffect(() => {
    if (!data || !heatmapRef.current || activeView !== 'heatmap') return;

    // Clear any existing chart to prevent overlaps
    d3.select(heatmapRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = heatmapRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(heatmapRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales for the heatmap's x-axis (days) and y-axis (temperature, humidity)
    const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.day)).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).domain(['temperature', 'humidity']).padding(0.05);

    // Color scales for temperature (reds) and humidity (blues)
    const temperatureColor = d3.scaleSequential().domain([d3.min(data, d => d.temperature), d3.max(data, d => d.temperature)]).interpolator(d3.interpolateReds);
    const humidityColor = d3.scaleSequential().domain([d3.min(data, d => d.humidity), d3.max(data, d => d.humidity)]).interpolator(d3.interpolateBlues);

    // Append heatmap cells
    data.forEach(d => {
      // Temperature cell
      svg.append('rect')
        .attr('x', x(d.day))
        .attr('y', y('temperature'))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', temperatureColor(d.temperature))
        .on('mouseover', function (event) {
          d3.select(this).style('stroke', 'black');
          tooltip.style('opacity', 1)
            .html(`Day: ${d.day}<br/>Temperature: ${d.temperature.toFixed(1)}°C`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).style('stroke', 'none');
          tooltip.style('opacity', 0);
        });

      // Humidity cell
      svg.append('rect')
        .attr('x', x(d.day))
        .attr('y', y('humidity'))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', humidityColor(d.humidity))
        .on('mouseover', function (event) {
          d3.select(this).style('stroke', 'black');
          tooltip.style('opacity', 1)
            .html(`Day: ${d.day}<br/>Humidity: ${d.humidity.toFixed(1)}%`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).style('stroke', 'none');
          tooltip.style('opacity', 0);
        });
    });

    // Tooltip for displaying temperature and humidity data
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px')
      .style('pointer-events', 'none');

    // Clean up tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [data, activeView, selectedMonth]);

  // Render scatter plot if data is available and the active view is 'scatter'
  useEffect(() => {
    if (!data || !scatterRef.current || activeView !== 'scatter') return;

    // Clear existing chart
    d3.select(scatterRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = scatterRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(scatterRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create x and y scales for temperature and humidity
    const x = d3.scaleLinear().domain([d3.min(data, d => d.temperature) - 1, d3.max(data, d => d.temperature) + 1]).range([0, width]);
    const y = d3.scaleLinear().domain([d3.min(data, d => d.humidity) - 1, d3.max(data, d => d.humidity) + 1]).range([height, 0]);

    // Add points to scatter plot and set tooltip behavior
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.temperature))
      .attr('cy', d => y(d.humidity))
      .attr('r', 6)
      .style('fill', '#2A9D8F')
      .style('opacity', 0.6)
      .on('mouseover', function (event, d) {
        d3.select(this).style('fill', '#E76F51').attr('r', 8);
        tooltip.style('opacity', 1)
          .html(`Day: ${d.day}<br/>Temperature: ${d.temperature.toFixed(1)}°C<br/>Humidity: ${d.humidity.toFixed(1)}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).style('fill', '#2A9D8F').attr('r', 6);
        tooltip.style('opacity', 0);
      });

    // Calculate and display regression line
    const xData = data.map(d => d.temperature);
    const yData = data.map(d => d.humidity);
    const regression = linearRegression(xData, yData);

    svg.append('line')
      .attr('x1', x(d3.min(xData)))
      .attr('y1', y(regression.slope * d3.min(xData) + regression.intercept))
      .attr('x2', x(d3.max(xData)))
      .attr('y2', y(regression.slope * d3.max(xData) + regression.intercept))
      .style('stroke', '#E76F51')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '4,4');

    return () => {
      tooltip.remove();
    };
  }, [data, activeView, selectedMonth]);

  // Linear regression helper function for scatter plot trend line
  const linearRegression = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  return (
    <div>
      <HeroSection title="Weather Data Analysis" description="Visualise and Explore Monthly Data With Heatmap or Correlation View" />
      <div className="container mx-auto p-6">
        <Card className="mb-6">
          {/* Month selection and view toggle buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">Month:</label>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="w-40">
                {monthNames.map((month, index) => (
                  <option key={month} value={index + 1}>{month}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button color={activeView === 'heatmap' ? "success" : "gray"} onClick={() => setActiveView('heatmap')}>
                Heatmap View
              </Button>
              <Button color={activeView === 'scatter' ? "success" : "gray"} onClick={() => setActiveView('scatter')}>
                Correlation View
              </Button>
            </div>
          </div>
        </Card>

        {/* Display spinner if loading, error if there's an issue, or render charts if data is available */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <Card>
            <div className="text-red-500 p-4">{error}</div>
          </Card>
        ) : data ? (
          <div className="space-y-6">
            {/* Conditionally render heatmap or scatter plot based on active view */}
            {activeView === 'heatmap' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Temperature and Humidity Heatmap</h3>
                </div>
                <div ref={heatmapRef} className="h-[400px] w-full" />
              </Card>
            )}

            {activeView === 'scatter' && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-bold">Temperature-Humidity Correlation</h3>
                </div>
                <div ref={scatterRef} className="h-[400px] w-full" />
              </Card>
            )}

            {/* Display temperature, humidity, and correlation stats */}
            {/* Each section uses D3 to calculate statistics like mean, median, std deviation, and correlation */}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-500">No data available</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DataVisualization;
