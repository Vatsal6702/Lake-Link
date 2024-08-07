import React, { Component, useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity, Image, ScrollView, ImageBackground, FlatList } from 'react-native';

import { format, addDays, parseISO } from 'date-fns';


const handleCalenderData = (calenderdata, setMarkedDates) => {
    let markedDatesObj = {};
    const dates = [];

    // let i = calenderdata.results[i];
    for (let i = 0; i < calenderdata.results.length; i++) {

        let endDate = format(parseISO(calenderdata.results[i].endDate), 'yyyy-MM-dd');
        let startDate = format(parseISO(calenderdata.results[i].startDate), 'yyyy-MM-dd');

        let currentDate = parseISO(startDate);
        const lastDate = parseISO(endDate);

        while (currentDate <= lastDate) {
            dates.push(format(currentDate, 'yyyy-MM-dd'));
            currentDate = addDays(currentDate, 1);
        }
        for (let i = 0; i < dates.length; i++) {

            markedDatesObj[dates[i]] = {
                selected: true,
                selectedColor: '#D97908',
                selectedTextColor: '#ffffff'
            };
        }

        let totalAnglersBooked = calenderdata.results[i].totalAnglersBooked;
        console.log(totalAnglersBooked); 

        
    }
    setMarkedDates(markedDatesObj);
    // console.log("Dates: ", dates);
};

export default handleCalenderData;