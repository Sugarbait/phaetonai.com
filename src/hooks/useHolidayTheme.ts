import { useState, useEffect } from 'react';

export const useHolidayTheme = () => {
  const [isHolidaySeason, setIsHolidaySeason] = useState(false);
  const [timeUntilRevert, setTimeUntilRevert] = useState<string>('');

  useEffect(() => {
    const checkHolidayStatus = () => {
      // Jan 1, 2026 at 12:00 AM UTC
      const revertDate = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
      const now = new Date();

      // Check if current time is before revert date
      const isHoliday = now < revertDate;
      setIsHolidaySeason(isHoliday);

      if (isHoliday) {
        // Calculate time remaining
        const timeDiff = revertDate.getTime() - now.getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeUntilRevert(`${days}d ${hours}h ${minutes}m`);
      }
    };

    checkHolidayStatus();

    // Update status every minute
    const interval = setInterval(checkHolidayStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return { isHolidaySeason, timeUntilRevert };
};
