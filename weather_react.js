import React, { useEffect, useState } from 'react';

const API_KEY = 'api 키';

function WeatherApp() {
    const [weatherData, setWeatherData] = useState({
        seoul: { city: '', temperature: '', sky: '' },
        busan: { city: '', temperature: '', sky: '' },
        incheon: { city: '', temperature: '', sky: '' }
    });

    const [weekWeather, setWeekWeather] = useState([]);

    useEffect(() => {
        fetchWeather('Seoul', 'seoul');
        fetchWeather('Busan', 'busan');
        fetchWeather('Incheon', 'incheon');
        fetchWeekWeather();
    }, []);

    async function fetchWeather(city, cityId) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === 200) {
                setWeatherData(prevState => ({
                    ...prevState,
                    [cityId]: {
                        city: data.name,
                        temperature: `${Math.round(data.main.temp - 273.15)}℃`,
                        sky: data.weather[0].main
                    }
                }));
            } else {
                alert(`위치를 찾을 수 없습니다. 에러 코드: ${data.cod}`);
            }

        } catch (err) {
            alert(err);
        }
    }

    async function fetchWeekWeather() {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${API_KEY}&units=metric`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const forecast = data.list;
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const weatherByDay = {};

            forecast.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayOfWeek = daysOfWeek[date.getDay()];

                if (!weatherByDay[dayOfWeek]) {
                    weatherByDay[dayOfWeek] = {
                        maxTemp: -Infinity,
                        minTemp: Infinity,
                        sky: ''
                    };
                }

                if (day.main.temp_max > weatherByDay[dayOfWeek].maxTemp) {
                    weatherByDay[dayOfWeek].maxTemp = day.main.temp_max;
                }
                if (day.main.temp_min < weatherByDay[dayOfWeek].minTemp) {
                    weatherByDay[dayOfWeek].minTemp = day.main.temp_min;
                }
                if (day.weather[0].main) {
                    weatherByDay[dayOfWeek].sky = day.weather[0].main;
                }
            });

            const weekWeatherData = daysOfWeek.map(dayOfWeek => ({
                dayOfWeek,
                maxTemp: weatherByDay[dayOfWeek].maxTemp.toFixed(1),
                minTemp: weatherByDay[dayOfWeek].minTemp.toFixed(1),
                sky: weatherByDay[dayOfWeek].sky
            }));

            setWeekWeather(weekWeatherData);

        } catch (error) {
            console.error('날씨 정보를 불러오는 중 오류가 발생했습니다.', error);
        }
    }

    return (
        <div className="container">
            <div className="weaterInfo">
                <div id="resultSeoul" className="resultWeather">
                    <div className="city">{weatherData.seoul.city}</div>
                    <div className="temperature">{weatherData.seoul.temperature}</div>
                    <div className="sky">{weatherData.seoul.sky}</div>
                </div>

                <div id="resultBusan" className="resultWeather">
                    <div className="city">{weatherData.busan.city}</div>
                    <div className="temperature">{weatherData.busan.temperature}</div>
                    <div className="sky">{weatherData.busan.sky}</div>
                </div>

                <div id="resultIncheon" className="resultWeather">
                    <div className="city">{weatherData.incheon.city}</div>
                    <div className="temperature">{weatherData.incheon.temperature}</div>
                    <div className="sky">{weatherData.incheon.sky}</div>
                </div>
            </div>

            <div className="koreaMap">
                <img src="koreaMap-gray.png" alt="Korea Map" style={{ width: '500px', height: '600px' }} />
            </div>

            <div className="weekWeather">
                <h1>주간 날씨 예보</h1>
                <div id="weather-container">
                    {weekWeather.map((weather, index) => (
                        <div key={index} className="weather-card">
                            <h2>{weather.dayOfWeek}</h2>
                            <p>최고 기온: {weather.maxTemp}°C</p>
                            <p>최저 기온: {weather.minTemp}°C</p>
                            <p>날씨 상태: {weather.sky}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WeatherApp;
