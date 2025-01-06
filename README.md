# Weather Prediction Dashboard

A React-based weather prediction dashboard using machine learning models for temperature and humidity forecasting. The application features multiple visualization libraries and interactive data analysis tools.


## Start the backend server
***Navigate to the root folder***: Navigate to the folder which contains frontend and backend folders, then run the following commands

```bash
cd backend
```

1. **Install Conda**: If you haven't already, install Anaconda.

2. **Install the required packages**:

```bash
conda install numpy pandas scikit-learn joblib pydantic -c conda-forge
```

3. **Train the models and start the backend**

```bash
python main.py
```

## Starting Frontend(in a separate terminal)
1. Start the frontend:
***Navigate to the root folder***: Navigate to the folder which contains frontend and backend folders, then run the following commands

```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Monthly Forecasts:
   - Select a month from the navigation
   - View temperature and humidity trends
   - Analyze statistical data

2. Daily Forecasts:
   - Choose a specific date
   - View hourly predictions
   - Interact with charts

3. Data Analysis:
   - Switch between different visualization types
   - Export data in various formats
   - View correlation analysis

## API Endpoints

### Temperature Endpoints
- POST `/prediction/temperature-regression/monthly`
- POST `/prediction/temperature-regression/day-hourly`
- POST `/prediction/temperature-classification/monthly`
- POST `/prediction/temperature-classification/day-hourly`

### Humidity Endpoints
- POST `/prediction/humidity-regression/monthly`
- POST `/prediction/humidity-regression/day-hourly`
- POST `/prediction/humidity-classification/monthly`
- POST `/prediction/humidity-classification/day-hourly`

## Development

### Frontend Structure
```
src/
├── components/
│   ├── MonthlyForecast.jsx
│   ├── DailyForecast.jsx
│   ├── DataVisualization.jsx
│   └── ui/
├── App.jsx
└── main.jsx
```

### Visualization Libraries
- Monthly View: Chart.js
- Daily View: Plotly.js
- Data Analysis: D3.js

# Features

### Monthly Forecasts
- Temperature and humidity predictions
- Interactive Chart.js visualizations
- Statistical analysis and trends
- Month-by-month comparison

### Daily Forecasts
- Hourly temperature and humidity predictions
- Interactive Plotly.js charts
- Date-based selection
- Detailed hourly statistics

### Data Analysis
- Advanced D3.js visualizations
- Correlation# analysis
- Heat maps and scatter plots
- Statistical computations
- Data export functionality (CSV, JSON)

## Technical Stack

### Frontend
- React 18
- Chart.js with react-chartjs-2
- Plotly.js with react-plotly.js
- D3.js
- Flowbite React components
- TailwindCSS

### Backend
- FastAPI
- Python ML models
- Pandas for data processing