
import React from 'react';
import { DisasterAlert } from './types';
import AlertCard from './AlertCard';
import { Loader2 } from 'lucide-react';

interface AlertsListProps {
  alerts: DisasterAlert[];
  isLoading: boolean;
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-guardian-purple" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">ไม่พบการแจ้งเตือนที่ตรงกับเงื่อนไข</p>
      </div>
    );
  }

  return (
    <div>
      {alerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertsList;
