import { useState, useEffect } from 'react';

const PASSING_DATE = new Date('2022-03-11T00:00:00Z').getTime();

export function useTimeSince() {
  const [time, setTime] = useState({ 
    years: 0, 
    months: 0, 
    weeks: 0, 
    days: 0, 
    hours: 0, 
    minutes: 0, 
    seconds: 0, 
    fridays: 0 
  });

  useEffect(() => {
    // Calculate total Fridays once
    const calculateFridays = () => {
      let fridaysCount = 0;
      let curr = new Date(PASSING_DATE);
      const now = new Date();
      while (curr <= now) {
        if (curr.getDay() === 5) fridaysCount++;
        curr.setDate(curr.getDate() + 1);
      }
      return fridaysCount;
    };
    
    const fridays = calculateFridays();

    const calc = () => {
      const now = new Date();
      let diff = now.getTime() - PASSING_DATE;

      if (diff < 0) diff = 0;

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      // Approximation for visual display
      const years = Math.floor(totalDays / 365.25);
      const remainingDaysAfterYears = totalDays % 365.25;
      const months = Math.floor(remainingDaysAfterYears / 30.44);
      const remainingDaysAfterMonths = Math.floor(remainingDaysAfterYears % 30.44);
      const weeks = Math.floor(remainingDaysAfterMonths / 7);
      const finalDays = remainingDaysAfterMonths % 7;

      setTime({ 
        years, 
        months, 
        weeks, 
        days: finalDays, 
        hours, 
        minutes, 
        seconds, 
        fridays 
      });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

export function useHijriDate() {
  const [dateStr, setDateStr] = useState("");
  
  useEffect(() => {
    try {
      const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      setDateStr(formatter.format(new Date()));
    } catch (e) {
      // Fallback if browser doesn't support islamic calendar formatting
      setDateStr("التاريخ الهجري");
    }
  }, []);
  
  return dateStr;
}
