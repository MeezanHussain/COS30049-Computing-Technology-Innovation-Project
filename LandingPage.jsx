import React from 'react';
import { useNavigate } from 'react-router-dom';
//import { Button, Card } from 'flowbite-react';
import Card from './ui/Card';
import StyledButton from './ui/StyledButton';
import HeroSection from './HeroSection';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <HeroSection
        title="Explore Machine-Learning Weather Predictions"
        description="Get reliable and accurate weather forecasts powered by machine learning insights."
      />
      {/* Features Section */}
      <section className="px-8 py-12 text-center" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">Our Key Features</h2>
            <p className="text-text-muted mb-8">Discover our Machine Learning based Weather prediction system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-primary text-xl font-bold mb-4">
                Monthly Predictions
              </h3>
              <p className="mb-6 text-gray-700">
                View in-depth monthly temperature and humidity predictions by AI models
              </p>
              <StyledButton
                color='primary'  
                onClick={() => navigate('/monthly')}
              >
                View Monthly Data
              </StyledButton>
            </Card>

            <Card>
              <h3 className="text-primary text-xl font-bold mb-4">
                Daily Forecasts
              </h3>
              <p className="mb-6 text-gray-700">
                View in-depth daily temperature and humidity predictions by AI models
              </p>
              <StyledButton 
                color="primary" 
                onClick={() => navigate('/daily')}
              >
                View Daily Forecast
              </StyledButton>
            </Card>

            <Card>
              <h3 className="text-primary text-xl font-bold mb-4">
                Data Visualization
              </h3>
              <p className="mb-6 text-gray-700">
                Understand complex data through beautiful and intuitive charts
              </p>
              <StyledButton 
                color="primary" 
                onClick={() => navigate('/visualization')}
              >
                View Charts
              </StyledButton>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;