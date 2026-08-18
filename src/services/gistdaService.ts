/**
 * GISTDA API 2.0 Gateway Service
 * Server: https://api-gateway.gistda.or.th/api/2.0/resources
 */

export const GISTDA_CONFIG = {
  BASE_URL: 'https://api-gateway.gistda.or.th/api/2.0/resources',
  PRIMARY_API_KEY: 'UIKDdatC5lgDcdrGxBJfyjHRlvRSvKQFGjY8A3mG00fj99MqcWCd2VxVTkcfkVX6',
  BACKUP_API_KEY: 'wFaHcoOyzK53pVqspkI9Mvobjm5vWzHVOwGOjzW4f2nAAvsVf8CETklHpX1peaDF',
  
  ENDPOINTS: {
    // Features (GeoJSON/Vector data)
    FEATURES: {
      VIIRS_1DAY: '/features/viirs/1day',
      VIIRS_3DAYS: '/features/viirs/3days',
      VIIRS_7DAYS: '/features/viirs/7days',
      VIIRS_30DAYS: '/features/viirs/30days',
      BURN_FREQ: '/features/burn-freq',
      BURN_SCAR: '/features/burn-scar',
      FLOOD_1DAY: '/features/flood/1day',
      FLOOD_3DAYS: '/features/flood/3days',
      FLOOD_7DAYS: '/features/flood/7days',
      FLOOD_30DAYS: '/features/flood/30days',
      FLOOD_FREQ: '/features/flood-freq',
      WATER_HYACINTH: '/features/water_hyacinth',
    },
    
    // Maps API (WMS)
    WMS: {
      VIIRS_1DAY: '/maps/viirs/1day/wms',
      VIIRS_3DAYS: '/maps/viirs/3days/wms',
      VIIRS_7DAYS: '/maps/viirs/7days/wms',
      VIIRS_30DAYS: '/maps/viirs/30days/wms',
      BURN_FREQ: '/maps/burn-freq/wms',
      BURN_SCAR: '/maps/burn-scar/wms',
      FLOOD_1DAY: '/maps/flood/1day/wms',
      FLOOD_3DAYS: '/maps/flood/3days/wms',
      FLOOD_7DAYS: '/maps/flood/7days/wms',
      FLOOD_30DAYS: '/maps/flood/30days/wms',
      FLOOD_FREQ: '/maps/flood-freq/wms',
      DRI_7DAYS: '/maps/dri/7days/wms',
      NDWI_7DAYS: '/maps/ndwi/7days/wms',
      SMAP_7DAYS: '/maps/smap/7days/wms',
    },
    
    // Maps API (WMTS)
    WMTS: {
      VIIRS_1DAY: '/maps/viirs/1day/wmts',
      VIIRS_3DAYS: '/maps/viirs/3days/wmts',
      VIIRS_7DAYS: '/maps/viirs/7days/wmts',
      VIIRS_30DAYS: '/maps/viirs/30days/wmts',
      BURN_FREQ: '/maps/burn-freq/wmts',
      BURN_SCAR: '/maps/burn-scar/wmts',
      FLOOD_1DAY: '/maps/flood/1day/wmts',
      FLOOD_3DAYS: '/maps/flood/3days/wmts',
      FLOOD_7DAYS: '/maps/flood/7days/wmts',
      FLOOD_30DAYS: '/maps/flood/30days/wmts',
      FLOOD_FREQ: '/maps/flood-freq/wmts',
      DRI_7DAYS: '/maps/dri/7days/wmts',
      NDWI_7DAYS: '/maps/ndwi/7days/wmts',
      SMAP_7DAYS: '/maps/smap/7days/wmts',
    },
    
    // Maps API (TMS)
    TMS: {
      VIIRS_1DAY: '/maps/viirs/1day/tms/{z}/{x}/{y}',
      VIIRS_3DAYS: '/maps/viirs/3days/tms/{z}/{x}/{y}',
      VIIRS_7DAYS: '/maps/viirs/7days/tms/{z}/{x}/{y}',
      VIIRS_30DAYS: '/maps/viirs/30days/tms/{z}/{x}/{y}',
      BURN_FREQ: '/maps/burn-freq/tms/{z}/{x}/{y}',
      BURN_SCAR: '/maps/burn-scar/tms/{z}/{x}/{y}',
      FLOOD_1DAY: '/maps/flood/1day/tms/{z}/{x}/{y}',
      FLOOD_3DAYS: '/maps/flood/3days/tms/{z}/{x}/{y}',
      FLOOD_7DAYS: '/maps/flood/7days/tms/{z}/{x}/{y}',
      FLOOD_30DAYS: '/maps/flood/30days/tms/{z}/{x}/{y}',
      FLOOD_FREQ: '/maps/flood-freq/tms/{z}/{x}/{y}',
      DRI_7DAYS: '/maps/dri/7days/tms/{z}/{x}/{y}',
      NDWI_7DAYS: '/maps/ndwi/7days/tms/{z}/{x}/{y}',
      SMAP_7DAYS: '/maps/smap/7days/tms/{z}/{x}/{y}',
    }
  }
};

export type ViirsTimeFilter = '1day' | '3days' | '7days' | '30days';
export type FloodTimeFilter = '1day' | '3days' | '7days' | '30days';
export type DroughtLayerType = 'dri' | 'ndwi' | 'smap';
export type WildfireMapProtocol = 'wmts' | 'tms' | 'wms';
export type FloodMapProtocol = 'wmts' | 'tms' | 'wms';
export type DroughtMapProtocol = 'wmts' | 'tms' | 'wms';

/**
 * Builds standard HTTP headers for GISTDA API requests
 */
export const getGistdaHeaders = (apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY): HeadersInit => {
  return {
    'accept': 'application/json',
    'API-Key': apiKey,
  };
};

/**
 * Generates full Feature API URL
 */
export const getGistdaFeatureUrl = (
  endpointPath: string, 
  limit: number = 1000, 
  offset: number = 0,
  filterThailand: boolean = true
): string => {
  const url = new URL(`${GISTDA_CONFIG.BASE_URL}${endpointPath}`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  if (filterThailand) {
    url.searchParams.set('ct_tn', 'ราชอาณาจักรไทย');
  }
  return url.toString();
};

/**
 * Generates Wildfire / Burn Area WMS Layer URL
 */
export const getGistdaWmsUrl = (
  type: 'viirs' | 'burn-freq' | 'burn-scar',
  timeFilter: ViirsTimeFilter = '3days',
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  if (type === 'burn-freq') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/burn-freq/wms?api_key=${apiKey}`;
  }
  if (type === 'burn-scar') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/burn-scar/wms?api_key=${apiKey}`;
  }
  return `${GISTDA_CONFIG.BASE_URL}/maps/viirs/${timeFilter}/wms?api_key=${apiKey}`;
};

/**
 * Generates Wildfire / Burn Area WMTS Layer URL
 */
export const getGistdaWmtsUrl = (
  type: 'viirs' | 'burn-freq' | 'burn-scar',
  timeFilter: ViirsTimeFilter = '3days',
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  if (type === 'burn-freq') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/burn-freq/wmts?api_key=${apiKey}`;
  }
  if (type === 'burn-scar') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/burn-scar/wmts?api_key=${apiKey}`;
  }
  return `${GISTDA_CONFIG.BASE_URL}/maps/viirs/${timeFilter}/wmts?api_key=${apiKey}`;
};

/**
 * Generates Wildfire / Burn Area TMS Tile Layer URL for Leaflet TileLayer
 */
export const getGistdaTmsTileUrl = (
  type: 'viirs' | 'burn-freq' | 'burn-scar',
  timeFilter: ViirsTimeFilter = '3days',
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  if (type === 'burn-freq') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/burn-freq/tms/{z}/{x}/{y}?api_key=${apiKey}`;
  }
  if (type === 'burn-scar') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/burn-scar/tms/{z}/{x}/{y}?api_key=${apiKey}`;
  }
  return `${GISTDA_CONFIG.BASE_URL}/maps/viirs/${timeFilter}/tms/{z}/{x}/{y}?api_key=${apiKey}`;
};

/**
 * Generates Flood WMS Layer URL
 */
export const getGistdaFloodWmsUrl = (
  type: 'flood' | 'flood-freq',
  timeFilter: FloodTimeFilter = '3days',
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  if (type === 'flood-freq') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/flood-freq/wms?api_key=${apiKey}`;
  }
  return `${GISTDA_CONFIG.BASE_URL}/maps/flood/${timeFilter}/wms?api_key=${apiKey}`;
};

/**
 * Generates Flood WMTS Layer URL
 */
export const getGistdaFloodWmtsUrl = (
  type: 'flood' | 'flood-freq',
  timeFilter: FloodTimeFilter = '3days',
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  if (type === 'flood-freq') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/flood-freq/wmts?api_key=${apiKey}`;
  }
  return `${GISTDA_CONFIG.BASE_URL}/maps/flood/${timeFilter}/wmts?api_key=${apiKey}`;
};

/**
 * Generates Flood TMS Tile Layer URL
 */
export const getGistdaFloodTmsTileUrl = (
  type: 'flood' | 'flood-freq',
  timeFilter: FloodTimeFilter = '3days',
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  if (type === 'flood-freq') {
    return `${GISTDA_CONFIG.BASE_URL}/maps/flood-freq/tms/{z}/{x}/{y}?api_key=${apiKey}`;
  }
  return `${GISTDA_CONFIG.BASE_URL}/maps/flood/${timeFilter}/tms/{z}/{x}/{y}?api_key=${apiKey}`;
};

/**
 * Generates Drought (DRIPlus, NDWI, SMAP) WMS Layer URL
 */
export const getGistdaDroughtWmsUrl = (
  layerType: DroughtLayerType,
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  return `${GISTDA_CONFIG.BASE_URL}/maps/${layerType}/7days/wms?api_key=${apiKey}`;
};

/**
 * Generates Drought (DRIPlus, NDWI, SMAP) WMTS Layer URL
 */
export const getGistdaDroughtWmtsUrl = (
  layerType: DroughtLayerType,
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  return `${GISTDA_CONFIG.BASE_URL}/maps/${layerType}/7days/wmts?api_key=${apiKey}`;
};

/**
 * Generates Drought (DRIPlus, NDWI, SMAP) TMS Tile Layer URL
 */
export const getGistdaDroughtTmsTileUrl = (
  layerType: DroughtLayerType,
  apiKey: string = GISTDA_CONFIG.PRIMARY_API_KEY
): string => {
  return `${GISTDA_CONFIG.BASE_URL}/maps/${layerType}/7days/tms/{z}/{x}/{y}?api_key=${apiKey}`;
};
