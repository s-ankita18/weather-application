import React, { useState } from 'react';
import './WeatherApp.css';

const WeatherApp = () => {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchWeather = async () => {
        if (!location.trim()) {
            setError('Please enter a location.');
            return;
        }
        setLoading(true);
        setError('');
        setWeatherData(null);
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=734136e4ee43465597c121539252912&q=${encodeURIComponent(location)}&aqi=yes`);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data.');
            }
            const data = await response.json();
            setWeatherData(data);
        } catch (err) {
            setError('Unable to fetch weather data. Please check the location and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeather();
    };

  // to get dynamic heading based on condition
    const getHeading = () => {
        if (weatherData && weatherData.current.condition.text) {
            return `${weatherData.current.condition.text} Weather`;
        }
        return 'Weather App';
    };

  return (
    <div className="weather-app">
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
            <div className="row w-100">
                <div className="col-md-6 col-lg-4 mx-auto">
                    <div className="card weather-card shadow-lg">
                        <div className="card-body text-center">
                            <h1 className="card-title mb-4">
                                <i className="fas fa-cloud-sun"></i> {getHeading()}
                            </h1>
                            <p className="card-text mb-4">Enter a city to get today's weather details.</p>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="e.g., New Delhi"
                                        value={location} onChange={(e) => setLocation(e.target.value)} 
                                        required
                                    />
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>} Get Weather
                                    </button>
                                </div>
                            </form>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {weatherData && (
                                <div className="weather-info mt-4">
                                    <div className="mb-3">
                                        <strong>Temperature: </strong> {weatherData.current.temp_c}°C
                                    </div>
                                    <div className="mb-3">
                                        <strong>Location: </strong> {weatherData.location.name}, {weatherData.location.country}
                                    </div>
                                    <div className="mb-3 d-flex align-items-center justify-content-center">
                                        {/* <img 
                                            src={`https:${weatherData.current.condition.icon}`} 
                                            alt={weatherData.current.condition.text} 
                                            className="weather-icon me-2" 
                                        /> */}
                                        <strong>Condition: </strong> {weatherData.current.condition.text}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default WeatherApp;