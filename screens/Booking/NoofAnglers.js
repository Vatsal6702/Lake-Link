import { format, addDays, parseISO } from 'date-fns';
import { useState } from 'react';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';


const NoofAnglers = (calenderdata, setMarkedDates1) => {
    const markedDatesObj = {};
    const Anglers = new MMKVLoader().initialize();
    let Maxanglers = Anglers.getInt('Maxanglers');


    for (let i = 0; i < calenderdata.results.length; i++) {
        const endDate = format(parseISO(calenderdata.results[i].endDate), 'yyyy-MM-dd');
        const startDate = format(parseISO(calenderdata.results[i].startDate), 'yyyy-MM-dd');

        const totalAnglersBooked = calenderdata.results[i].totalAnglersBooked;
        const remaininganglers = Maxanglers - totalAnglersBooked;

        //  console.warn(remaininganglers);


        const userBookedAnglers = calenderdata.results[i].userBookedAnglers;

        const currentDate = parseISO(startDate);
        const lastDate = parseISO(endDate);

        while (currentDate <= lastDate) {
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            currentDate.setDate(currentDate.getDate() + 1); // Use setDate() method to increment the date
        }
    }

    setMarkedDates1(markedDatesObj);
};

export default NoofAnglers;