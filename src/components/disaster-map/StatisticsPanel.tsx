
import React from 'react';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Earth, AlertTriangle, ChartBar, TrendingUp } from 'lucide-react';
import { EarthquakeStats } from './types';

interface StatisticsPanelProps {
  stats: EarthquakeStats;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-4">
      <Card>
        <CardContent className="p-3 flex items-center space-x-2">
          <Earth className="h-5 w-5 text-blue-500" />
          <div>
            <CardDescription>Total Earthquakes</CardDescription>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <div>
            <CardDescription>Average Magnitude</CardDescription>
            <p className="text-2xl font-bold">{stats.averageMagnitude.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 flex items-center space-x-2">
          <ChartBar className="h-5 w-5 text-purple-500" />
          <div>
            <CardDescription>Max Magnitude</CardDescription>
            <p className="text-2xl font-bold">{stats.maxMagnitude.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <CardDescription>Significant</CardDescription>
            <p className="text-2xl font-bold">{stats.significantCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPanel;
