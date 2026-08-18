import { useQuery } from '@tanstack/react-query';
import { fetchWeatherApi } from 'openmeteo';

export interface OpenMeteoWeatherData {
  current: {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: number;
    snowfall: number;
    showers: number;
    precipitation: number;
    rain: number;
    weatherCode: number;
    cloudCover: number;
    pressureMsl: number;
    surfacePressure: number;
    windGusts10m: number;
    windDirection10m: number;
    windSpeed10m: number;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array;
    relativeHumidity2m: Float32Array;
    dewPoint2m: Float32Array;
    apparentTemperature: Float32Array;
    precipitation: Float32Array;
    rain: Float32Array;
    showers: Float32Array;
    windSpeed10m: Float32Array;
    windDirection10m: Float32Array;
    windGusts10m: Float32Array;
    soilMoisture0To1cm: Float32Array;
    soilMoisture1To3cm: Float32Array;
    soilMoisture3To9cm: Float32Array;
    precipitationProbability: Float32Array;
    cloudCover: Float32Array;
    surfacePressure: Float32Array;
    pressureMsl: Float32Array;
    weatherCode: Float32Array;
  };
  daily: {
    time: Date[];
    temperature2mMax: Float32Array;
    temperature2mMin: Float32Array;
    weatherCode: Float32Array;
    rainSum: Float32Array;
    showersSum: Float32Array;
    precipitationSum: Float32Array;
    precipitationHours: Float32Array;
    precipitationProbabilityMax: Float32Array;
    windDirection10mDominant: Float32Array;
    windGusts10mMax: Float32Array;
    windSpeed10mMax: Float32Array;
  };
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
    timezoneAbbreviation: string;
  };
}

export interface OpenMeteoRainDataPoint {
  locationName: string;
  province: string;
  region: 'เหนือ' | 'ตะวันออกเฉียงเหนือ' | 'กลาง' | 'ตะวันออก' | 'ตะวันตก' | 'ใต้';
  lat: number;
  lon: number;
  weatherData: OpenMeteoWeatherData;
}

export const THAILAND_WEATHER_POINTS = [
  // ภาคกลาง
  { lat: 13.7563, lon: 100.5018, name: 'กรุงเทพมหานคร', province: 'กรุงเทพมหานคร', region: 'กลาง' as const },
  { lat: 14.3532, lon: 100.5706, name: 'พระนครศรีอยุธยา', province: 'พระนครศรีอยุธยา', region: 'กลาง' as const },
  { lat: 14.0208, lon: 100.5250, name: 'ปทุมธานี', province: 'ปทุมธานี', region: 'กลาง' as const },
  { lat: 14.5289, lon: 100.9105, name: 'สระบุรี', province: 'สระบุรี', region: 'กลาง' as const },
  { lat: 15.7047, lon: 100.1372, name: 'นครสวรรค์', province: 'นครสวรรค์', region: 'กลาง' as const },
  // ภาคเหนือ
  { lat: 18.7883, lon: 98.9853, name: 'เชียงใหม่', province: 'เชียงใหม่', region: 'เหนือ' as const },
  { lat: 19.9071, lon: 99.8831, name: 'เชียงราย', province: 'เชียงราย', region: 'เหนือ' as const },
  { lat: 19.3020, lon: 97.9654, name: 'แม่ฮ่องสอน', province: 'แม่ฮ่องสอน', region: 'เหนือ' as const },
  { lat: 18.2816, lon: 99.4916, name: 'ลำปาง', province: 'ลำปาง', region: 'เหนือ' as const },
  { lat: 18.7756, lon: 100.7730, name: 'น่าน', province: 'น่าน', region: 'เหนือ' as const },
  { lat: 16.8211, lon: 100.2659, name: 'พิษณุโลก', province: 'พิษณุโลก', region: 'เหนือ' as const },
  { lat: 16.4193, lon: 101.1609, name: 'เพชรบูรณ์', province: 'เพชรบูรณ์', region: 'เหนือ' as const },
  // ภาคตะวันออกเฉียงเหนือ
  { lat: 14.9799, lon: 102.0977, name: 'นครราชสีมา (โคราช)', province: 'นครราชสีมา', region: 'ตะวันออกเฉียงเหนือ' as const },
  { lat: 16.4419, lon: 102.8360, name: 'ขอนแก่น', province: 'ขอนแก่น', region: 'ตะวันออกเฉียงเหนือ' as const },
  { lat: 17.4138, lon: 102.7877, name: 'อุดรธานี', province: 'อุดรธานี', region: 'ตะวันออกเฉียงเหนือ' as const },
  { lat: 17.8782, lon: 102.7412, name: 'หนองคาย', province: 'หนองคาย', region: 'ตะวันออกเฉียงเหนือ' as const },
  { lat: 15.2448, lon: 104.8471, name: 'อุบลราชธานี', province: 'อุบลราชธานี', region: 'ตะวันออกเฉียงเหนือ' as const },
  { lat: 17.1547, lon: 104.1359, name: 'สกลนคร', province: 'สกลนคร', region: 'ตะวันออกเฉียงเหนือ' as const },
  { lat: 14.9930, lon: 103.1029, name: 'บุรีรัมย์', province: 'บุรีรัมย์', region: 'ตะวันออกเฉียงเหนือ' as const },
  // ภาคตะวันออก
  { lat: 13.3611, lon: 100.9847, name: 'ชลบุรี (พัทยา)', province: 'ชลบุรี', region: 'ตะวันออก' as const },
  { lat: 12.6868, lon: 101.2228, name: 'ระยอง', province: 'ระยอง', region: 'ตะวันออก' as const },
  { lat: 12.6103, lon: 102.1038, name: 'จันทบุรี', province: 'จันทบุรี', region: 'ตะวันออก' as const },
  { lat: 12.2436, lon: 102.5156, name: 'ตราด (เกาะช้าง)', province: 'ตราด', region: 'ตะวันออก' as const },
  // ภาคตะวันตก
  { lat: 14.0227, lon: 99.5283, name: 'กาญจนบุรี', province: 'กาญจนบุรี', region: 'ตะวันตก' as const },
  { lat: 16.8684, lon: 99.1260, name: 'ตาก (แม่สอด)', province: 'ตาก', region: 'ตะวันตก' as const },
  { lat: 12.5684, lon: 99.9577, name: 'ประจวบคีรีขันธ์ (หัวหิน)', province: 'ประจวบคีรีขันธ์', region: 'ตะวันตก' as const },
  // ภาคใต้
  { lat: 10.4930, lon: 99.1797, name: 'ชุมพร', province: 'ชุมพร', region: 'ใต้' as const },
  { lat: 9.9558, lon: 98.6351, name: 'ระนอง', province: 'ระนอง', region: 'ใต้' as const },
  { lat: 9.1326, lon: 99.3292, name: 'สุราษฎร์ธานี (สมุย)', province: 'สุราษฎร์ธานี', region: 'ใต้' as const },
  { lat: 7.8804, lon: 98.3923, name: 'ภูเก็ต', province: 'ภูเก็ต', region: 'ใต้' as const },
  { lat: 8.0863, lon: 98.9063, name: 'กระบี่', province: 'กระบี่', region: 'ใต้' as const },
  { lat: 8.4304, lon: 99.9581, name: 'นครศรีธรรมราช', province: 'นครศรีธรรมราช', region: 'ใต้' as const },
  { lat: 6.9955, lon: 100.4664, name: 'สงขลา (หาดใหญ่)', province: 'สงขลา', region: 'ใต้' as const },
  { lat: 6.5410, lon: 101.2802, name: 'ยะลา (เบตง)', province: 'ยะลา', region: 'ใต้' as const },
  { lat: 6.4254, lon: 101.8253, name: 'นราธิวาส', province: 'นราธิวาส', region: 'ใต้' as const }
];

async function fetchOpenMeteoWeatherData(): Promise<OpenMeteoRainDataPoint[]> {
  const params = {
    latitude: THAILAND_WEATHER_POINTS.map(p => p.lat),
    longitude: THAILAND_WEATHER_POINTS.map(p => p.lon),
    daily: [
      "temperature_2m_max", "temperature_2m_min", "weather_code", 
      "rain_sum", "showers_sum", "precipitation_sum", "precipitation_hours", 
      "precipitation_probability_max", "wind_direction_10m_dominant", 
      "wind_gusts_10m_max", "wind_speed_10m_max"
    ],
    hourly: [
      "temperature_2m", "relative_humidity_2m", "dew_point_2m", 
      "apparent_temperature", "precipitation", "rain", "showers", 
      "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
      "soil_moisture_0_to_1cm", "soil_moisture_1_to_3cm", "soil_moisture_3_to_9cm",
      "precipitation_probability", "cloud_cover", "surface_pressure", 
      "pressure_msl", "weather_code"
    ],
    current: [
      "temperature_2m", "relative_humidity_2m", "apparent_temperature", 
      "is_day", "snowfall", "showers", "precipitation", "rain", 
      "weather_code", "cloud_cover", "pressure_msl", "surface_pressure", 
      "wind_gusts_10m", "wind_direction_10m", "wind_speed_10m"
    ],
    timezone: "Asia/Bangkok"
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  return responses.map((response, index) => {
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    const weatherData: OpenMeteoWeatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: Math.round(current.variables(0)!.value() * 10) / 10,
        relativeHumidity2m: Math.round(current.variables(1)!.value()),
        apparentTemperature: Math.round(current.variables(2)!.value() * 10) / 10,
        isDay: current.variables(3)!.value(),
        snowfall: current.variables(4)!.value(),
        showers: Math.round(current.variables(5)!.value() * 10) / 10,
        precipitation: Math.round(current.variables(6)!.value() * 10) / 10,
        rain: Math.round(current.variables(7)!.value() * 10) / 10,
        weatherCode: current.variables(8)!.value(),
        cloudCover: Math.round(current.variables(9)!.value()),
        pressureMsl: Math.round(current.variables(10)!.value()),
        surfacePressure: Math.round(current.variables(11)!.value()),
        windGusts10m: Math.round(current.variables(12)!.value() * 10) / 10,
        windDirection10m: Math.round(current.variables(13)!.value()),
        windSpeed10m: Math.round(current.variables(14)!.value() * 10) / 10,
      },
      hourly: {
        time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
          (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
        dewPoint2m: hourly.variables(2)!.valuesArray()!,
        apparentTemperature: hourly.variables(3)!.valuesArray()!,
        precipitation: hourly.variables(4)!.valuesArray()!,
        rain: hourly.variables(5)!.valuesArray()!,
        showers: hourly.variables(6)!.valuesArray()!,
        windSpeed10m: hourly.variables(7)!.valuesArray()!,
        windDirection10m: hourly.variables(8)!.valuesArray()!,
        windGusts10m: hourly.variables(9)!.valuesArray()!,
        soilMoisture0To1cm: hourly.variables(10)!.valuesArray()!,
        soilMoisture1To3cm: hourly.variables(11)!.valuesArray()!,
        soilMoisture3To9cm: hourly.variables(12)!.valuesArray()!,
        precipitationProbability: hourly.variables(13)!.valuesArray()!,
        cloudCover: hourly.variables(14)!.valuesArray()!,
        surfacePressure: hourly.variables(15)!.valuesArray()!,
        pressureMsl: hourly.variables(16)!.valuesArray()!,
        weatherCode: hourly.variables(17)!.valuesArray()!,
      },
      daily: {
        time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        ),
        temperature2mMax: daily.variables(0)!.valuesArray()!,
        temperature2mMin: daily.variables(1)!.valuesArray()!,
        weatherCode: daily.variables(2)!.valuesArray()!,
        rainSum: daily.variables(3)!.valuesArray()!,
        showersSum: daily.variables(4)!.valuesArray()!,
        precipitationSum: daily.variables(5)!.valuesArray()!,
        precipitationHours: daily.variables(6)!.valuesArray()!,
        precipitationProbabilityMax: daily.variables(7)!.valuesArray()!,
        windDirection10mDominant: daily.variables(8)!.valuesArray()!,
        windGusts10mMax: daily.variables(9)!.valuesArray()!,
        windSpeed10mMax: daily.variables(10)!.valuesArray()!,
      },
      location: {
        latitude: response.latitude(),
        longitude: response.longitude(),
        timezone: response.timezone(),
        timezoneAbbreviation: response.timezoneAbbreviation(),
      }
    };

    const pointMeta = THAILAND_WEATHER_POINTS[index] || {
      name: `Point ${index}`,
      province: 'ไทย',
      region: 'กลาง' as const,
      lat: response.latitude(),
      lon: response.longitude()
    };

    return {
      locationName: pointMeta.name,
      province: pointMeta.province,
      region: pointMeta.region,
      lat: pointMeta.lat,
      lon: pointMeta.lon,
      weatherData
    };
  });
}

export const useOpenMeteoRainData = () => {
  return useQuery({
    queryKey: ['open-meteo-weather-points-v2'],
    queryFn: fetchOpenMeteoWeatherData,
    refetchInterval: 600000, // 10 minutes
    staleTime: 300000, // 5 minutes
  });
};
