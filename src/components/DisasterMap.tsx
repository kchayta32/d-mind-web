import React from 'react';
import DisasterMap from './disaster-map/DisasterMap';
import { DisasterMapErrorBoundary } from './disaster-map/ErrorBoundary';

const DisasterMapWrapper: React.FC = () => {
  return (
    <DisasterMapErrorBoundary>
      <DisasterMap />
    </DisasterMapErrorBoundary>
  );
};

export default DisasterMapWrapper;
