import { useState } from 'react';
import { DisasterType } from '../DisasterMap';
import { WildfireMapProtocol, FloodMapProtocol, DroughtMapProtocol } from '@/services/gistdaService';

export const useDisasterMapState = () => {
  const [selectedType, setSelectedType] = useState<DisasterType>('earthquake');
  const [magnitudeFilter, setMagnitudeFilter] = useState(1.0);
  const [humidityFilter, setHumidityFilter] = useState(0);
  const [rainTimeFilter, setRainTimeFilter] = useState('realtime');
  const [pm25Filter, setPm25Filter] = useState(0);
  
  // Wildfire state
  const [wildfireTimeFilter, setWildfireTimeFilter] = useState('3days');
  const [showBurnFreq, setShowBurnFreq] = useState(false);
  const [showBurnScar, setShowBurnScar] = useState(false);
  const [wildfireMapMode, setWildfireMapMode] = useState<WildfireMapProtocol>('wmts');
  
  // Drought state
  const [droughtLayers, setDroughtLayers] = useState(['dri']);
  const [droughtMapMode, setDroughtMapMode] = useState<DroughtMapProtocol>('wmts');
  
  // Flood state
  const [floodTimeFilter, setFloodTimeFilter] = useState('3days');
  const [showFloodFrequency, setShowFloodFrequency] = useState(true);
  const [showWaterHyacinth, setShowWaterHyacinth] = useState(false);
  const [floodMapMode, setFloodMapMode] = useState<FloodMapProtocol>('wmts');

  return {
    selectedType,
    setSelectedType,
    magnitudeFilter,
    setMagnitudeFilter,
    humidityFilter,
    setHumidityFilter,
    rainTimeFilter,
    setRainTimeFilter,
    pm25Filter,
    setPm25Filter,
    wildfireTimeFilter,
    setWildfireTimeFilter,
    showBurnFreq,
    setShowBurnFreq,
    showBurnScar,
    setShowBurnScar,
    wildfireMapMode,
    setWildfireMapMode,
    droughtLayers,
    setDroughtLayers,
    droughtMapMode,
    setDroughtMapMode,
    floodTimeFilter,
    setFloodTimeFilter,
    showFloodFrequency,
    setShowFloodFrequency,
    showWaterHyacinth,
    setShowWaterHyacinth,
    floodMapMode,
    setFloodMapMode,
  };
};
