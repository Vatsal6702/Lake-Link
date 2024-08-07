import { format, addDays, parseISO } from 'date-fns';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import React, { Component, useEffect, useState } from 'react';

const handleCalenderData = (calenderdata, setMarkedDates) => {
  const markedDatesObj = {};
  const Anglers = new MMKVLoader().initialize();
  let Maxanglers = Anglers.getInt('Maxanglers');


  for (let i = 0; i < calenderdata.results.length; i++) {

    const endDate = format(parseISO(calenderdata.results[i].endDate), 'yyyy-MM-dd');
    const startDate = format(parseISO(calenderdata.results[i].startDate), 'yyyy-MM-dd');

    const totalAnglersBooked = calenderdata.results[i].totalAnglersBooked;
    const userBookedAnglers = calenderdata.results[i].userBookedAnglers;

    const currentDate = parseISO(startDate);
    const lastDate = parseISO(endDate);

    while (currentDate <= lastDate) {
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      if (!markedDatesObj[formattedDate]) {
        markedDatesObj[formattedDate] = {
          selected: true,
          selectedTextColor: '#ffffff',
          selectedColor: '#f5f5f5'
        };
      }

      if (totalAnglersBooked == Maxanglers) {
        markedDatesObj[formattedDate] = { selected: true, selectedColor: '#E70808', selectedTextColor: '#f5f5f5' };
      } else if (userBookedAnglers != null) {
        markedDatesObj[formattedDate] = { selected: true, selectedColor: '#4DED75', selectedTextColor: 'black' };
      } else if (totalAnglersBooked < Maxanglers) {
        markedDatesObj[formattedDate] = { selected: true, selectedColor: '#D97908', selectedTextColor: '#f5f5f5' };
      }

      currentDate.setDate(currentDate.getDate() + 1); // Use setDate() method to increment the date
    }
  }
  
  setMarkedDates(markedDatesObj);
};

export default handleCalenderData;