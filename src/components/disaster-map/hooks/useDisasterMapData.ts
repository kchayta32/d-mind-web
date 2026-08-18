import { DisasterType } from '../DisasterMap';
import { useEarthquakeData, EarthquakeTimeWindow, EarthquakeFeedSource } from '../useEarthquakeData';
import { useRainSensorData } from '../useRainSensorData';
import { useGISTDAData } from '../useGISTDAData';
import { useAirPollutionData } from '../useAirPollutionData';
import { useRainViewerData } from '../useRainViewerData';
import { useDroughtData } from './useDroughtData';
import { useFloodStatistics } from './useFloodData';
import { useGISTDAFloodData } from './useGISTDAFloodData';
import { useOpenMeteoFloodData } from './useOpenMeteoFloodData';
import { useOpenMeteoRainData } from './useOpenMeteoRainData';
import { useStormData } from './useStormData';
import { useVolcanoData } from './useVolcanoData';
import { useBurnFrequencyData, useBurnScarData } from './useBurnAreaData';
import { 
  EarthquakeStats, 
  RainSensorStats, 
  AirPollutionStats,
  RainViewerStats,
  OpenMeteoRainStats,
  StormStats,
  VolcanoStats
} from '../types';
import { WildfireStats } from '../useGISTDAData';
import { DroughtStats } from './useDroughtData';
import { FloodStats } from './useFloodData';
import { SinkholeStats } from '../../../hooks/useSinkholeData';

interface StatisticsWithRainViewer extends RainSensorStats {
  rainViewer?: RainViewerStats;
}

export const useDisasterMapData = (
  rainTimeFilter: string,
  wildfireTimeFilter: string,
  floodTimeFilter: string,
  earthquakeTimeWindow: EarthquakeTimeWindow = '7days',
  earthquakeFeedSource: EarthquakeFeedSource = 'all'
) => {
  const { earthquakes, stats: earthquakeStats, isLoading: isLoadingEarthquakes, refetch: refetchEarthquakes } = useEarthquakeData(earthquakeTimeWindow, earthquakeFeedSource);
  const { sensors: rainSensors, stats: rainStats, isLoading: isLoadingRain } = useRainSensorData(rainTimeFilter);
  const { hotspots, stats: wildfireStats, isLoading: isLoadingWildfire, refetch: refetchWildfire } = useGISTDAData(wildfireTimeFilter as any);
  const { data: burnFreqData } = useBurnFrequencyData();
  const { data: burnScarData } = useBurnScarData();
  const { stations: airStations, stats: airStats, isLoading: isLoadingAir, refetch: refetchAir } = useAirPollutionData();
  const { rainData, isLoading: isLoadingRainViewer, refetch: refetchRainViewer } = useRainViewerData();
  const { stats: droughtStats, isLoading: isLoadingDrought } = useDroughtData();
  const { data: gistdaFloodData, isLoading: isLoadingGISTDAFlood } = useGISTDAFloodData(floodTimeFilter as any);
  const { data: floodStats, isLoading: isLoadingFlood } = useFloodStatistics();
  const { data: floodDataPoints, gdacsFloods, isLoading: isLoadingOpenMeteoFlood } = useOpenMeteoFloodData();
  const { data: openMeteoRainData, isLoading: isLoadingOpenMeteoRain, refetch: refetchOpenMeteoRain } = useOpenMeteoRainData();
  const { storms, stats: stormStats, isLoading: isLoadingStorms } = useStormData();
  const { volcanoes, stats: volcanoStats, isLoading: isLoadingVolcanoes } = useVolcanoData();

  // Enhanced rain stats with RainViewer data
  const enhancedRainStats = rainData ? {
    ...rainStats,
    rainViewer: {
      lastUpdated: new Date().toISOString(),
      totalFrames: (rainData.radar?.past?.length || 0) + (rainData.radar?.nowcast?.length || 0),
      pastFrames: rainData.radar?.past?.length || 0,
      futureFrames: rainData.radar?.nowcast?.length || 0
    }
  } : rainStats;

  // Get current stats and loading state
  const getCurrentStats = (selectedType: DisasterType): EarthquakeStats | StatisticsWithRainViewer | WildfireStats | AirPollutionStats | DroughtStats | FloodStats | OpenMeteoRainStats | StormStats | VolcanoStats | SinkholeStats | null => {
    switch (selectedType) {
      case 'earthquake': return earthquakeStats;
      case 'heavyrain': return enhancedRainStats;
      case 'openmeteorain': {
        const points = openMeteoRainData || [];
        const openMeteoStats: OpenMeteoRainStats = {
          totalStations: points.length,
          activeRainStations: points.filter(d => (d?.weatherData?.current?.rain || 0) > 0 || (d?.weatherData?.current?.precipitation || 0) > 0).length,
          maxRainfall: points.length > 0 ? Math.max(...points.map(d => Number(d?.weatherData?.current?.rain || d?.weatherData?.current?.precipitation || 0))) : 0,
          avgTemperature: points.length > 0 ? Math.round((points.reduce((sum, d) => sum + Number(d?.weatherData?.current?.temperature2m || 0), 0) / points.length) * 10) / 10 : 0,
          lastUpdated: new Date().toISOString()
        };
        return openMeteoStats;
      }
      case 'wildfire': return wildfireStats;
      case 'airpollution': return airStats;
      case 'drought': return droughtStats;
      case 'flood': return floodStats;
      case 'storm': return stormStats;
      case 'volcano': return volcanoStats;
      case 'sinkhole': return null;
      default: return null;
    }
  };

  const getCurrentLoading = (selectedType: DisasterType) => {
    switch (selectedType) {
      case 'earthquake': return isLoadingEarthquakes;
      case 'heavyrain': return isLoadingRain || isLoadingRainViewer;
      case 'openmeteorain': return isLoadingOpenMeteoRain;
      case 'wildfire': return isLoadingWildfire;
      case 'airpollution': return isLoadingAir;
      case 'drought': return isLoadingDrought;
      case 'flood': return isLoadingFlood || isLoadingOpenMeteoFlood || isLoadingGISTDAFlood;
      case 'storm': return isLoadingStorms;
      case 'volcano': return isLoadingVolcanoes;
      case 'sinkhole': return false;
      default: return false;
    }
  };

  const refetchAll = () => {
    refetchEarthquakes?.();
    refetchAir?.();
    refetchRainViewer?.();
    refetchOpenMeteoRain?.();
    refetchWildfire?.();
  };

  return {
    earthquakes: earthquakes || [],
    rainSensors: rainSensors || [],
    hotspots: hotspots || [],
    burnFreqFeatures: burnFreqData?.features || [],
    burnScarFeatures: burnScarData?.features || [],
    airStations: airStations || [],
    rainData,
    gistdaFloodFeatures: gistdaFloodData?.features || [],
    floodDataPoints: floodDataPoints || [],
    gdacsFloods: gdacsFloods || [],
    openMeteoRainData: openMeteoRainData || [],
    storms: storms || [],
    volcanoes: volcanoes || [],
    earthquakeStats,
    rainStats: enhancedRainStats,
    wildfireStats,
    airStats,
    droughtStats,
    floodStats,
    stormStats,
    volcanoStats,
    getCurrentStats,
    getCurrentLoading,
    refetchAll
  };
};
