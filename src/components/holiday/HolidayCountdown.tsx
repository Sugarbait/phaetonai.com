import React from 'react';
import { useHolidayTheme } from '../../hooks/useHolidayTheme';

const HolidayCountdown: React.FC = () => {
  const { isHolidaySeason, timeUntilRevert } = useHolidayTheme();

  if (!isHolidaySeason || !timeUntilRevert) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-2 border-red-500 rounded-lg p-3 shadow-lg">
      <p className="text-xs text-gray-600 font-medium">Holiday theme reverts in:</p>
      <p className="text-sm font-bold text-red-600 mt-1">{timeUntilRevert}</p>
    </div>
  );
};

export default HolidayCountdown;
