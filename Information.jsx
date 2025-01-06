import React from 'react';
import { Card } from 'flowbite-react';
import {
  Brain,
  LineChart,
  Database,
  BarChart2,
  ThermometerSun,
  Droplets,
  Calculator,
  RefreshCw
} from 'lucide-react';
import HeroSection from './HeroSection';

function Information() {
  return (
    <div>
      {/* Hero Section - Provides the main title and description of the weather prediction system */}
      <HeroSection
        title="Weather Prediction System"
        description="Our advanced machine learning-based weather forecasting system combines historical data
            analysis with modern prediction techniques to provide accurate temperature and humidity forecasts."
      />
      <div className="container mx-auto p-6">
        {/* Header Section - Space for additional header content if needed */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">

          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">

          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* How It Works Section - Describes the core approach of the system */}
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <Brain className="h-6 w-6" />
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Data Collection Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data Collection
                </h3>
                <p className="text-gray-600">
                  Our system utilizes historical weather data collected over extended periods,
                  including temperature, humidity, and other meteorological parameters. This data
                  forms the foundation of our prediction models.
                </p>
              </Card>

              {/* Machine Learning Models Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Machine Learning Models
                </h3>
                <p className="text-gray-600">
                  We employ sophisticated machine learning algorithms, including Random Forest
                  regression and classification models, to analyze patterns and make predictions
                  based on historical trends.
                </p>
              </Card>
            </div>
          </section>

          {/* Prediction Types - Highlights different prediction outputs */}
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              Prediction Types
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Temperature Forecasting Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5 text-yellow-500" />
                  Temperature Forecasting
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Hourly temperature predictions</li>
                  <li>• Daily temperature trends</li>
                  <li>• Monthly temperature patterns</li>
                  <li>• Temperature classification based on comfort levels</li>
                </ul>
              </Card>

              {/* Humidity Analysis Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Humidity Analysis
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Hourly humidity forecasts</li>
                  <li>• Daily humidity patterns</li>
                  <li>• Monthly humidity trends</li>
                  <li>• Humidity classification for comfort assessment</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Features and Capabilities - Lists functionalities and features of the application */}
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <BarChart2 className="h-6 w-6" />
              Features and Capabilities
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Monthly Analysis Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Monthly Analysis</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Detailed monthly forecasts</li>
                  <li>• Trend analysis</li>
                  <li>• Statistical summaries</li>
                  <li>• Historical comparisons</li>
                </ul>
              </Card>

              {/* Daily Forecasts Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Daily Forecasts</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Hourly predictions</li>
                  <li>• Day-specific patterns</li>
                  <li>• Visual representations</li>
                  <li>• Accuracy metrics</li>
                </ul>
              </Card>

              {/* Data Visualization Card */}
              <Card>
                <h3 className="text-xl font-semibold mb-4">Data Visualization</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Interactive charts</li>
                  <li>• Correlation analysis</li>
                  <li>• Pattern recognition</li>
                  <li>• Export capabilities</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Update Cycle - Describes model updates and accuracy measures */}
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
              <RefreshCw className="h-6 w-6" />
              Update Cycle and Accuracy
            </h2>
            <Card>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Model Updates</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Regular model retraining</li>
                    <li>• Continuous accuracy improvements</li>
                    <li>• Pattern adaptation</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Accuracy Metrics</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Temperature prediction accuracy: ±1.5°C</li>
                    <li>• Humidity prediction accuracy: ±5%</li>
                    <li>• Pattern recognition rate: 85%</li>
                    <li>• Continuous validation process</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>

          {/* Technical Details - Lists technology stack used in the project */}
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-6">Technical Details</h2>
            <Card>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Technologies Used</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Backend Technologies */}
                  <div>
                    <h4 className="font-semibold mb-2">Backend</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Python</li>
                      <li>• FastAPI</li>
                      <li>• Pandas</li>
                      <li>• Scikit-learn</li>
                    </ul>
                  </div>
                  {/* Frontend Technologies */}
                  <div>
                    <h4 className="font-semibold mb-2">Frontend</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• React</li>
                      <li>• Tailwind CSS</li>
                      <li>• Flowbite Components</li>
                      <li>• Recharts</li>
                    </ul>
                  </div>
                  {/* Machine Learning Techniques */}
                  <div>
                    <h4 className="font-semibold mb-2">Machine Learning</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Random Forest</li>
                      <li>• Classification Models</li>
                      <li>• Regression Analysis</li>
                      <li>• Statistical Processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Information;
