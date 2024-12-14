import { useState } from 'react';
import { getDaysInMonth } from '@/lib/calendar-utils';

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const navigateToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const navigateToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    days,
    navigateToPrevMonth,
    navigateToNextMonth,
  };
}