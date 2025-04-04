import { format, formatDistanceToNow, addDays } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

// Get today's date in YYYY-MM-DD format
export const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Get an array of the next n days (including today)
export const getNextNDays = (n: number): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    days.push(addDays(today, i));
  }
  
  return days;
};