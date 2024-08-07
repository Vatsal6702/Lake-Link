import React, { Component, useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity, Image, ScrollView, ImageBackground, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { format, addDays, parseISO, startOfWeek } from 'date-fns';
import handleCalenderData from './HandelCalender';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Booking = (props) => {
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDates, setselectedDates] = useState({});
    const [lakesdetails, setLakesDetails] = useState([]);
    const [calender, setCalender] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    const MMKV = new MMKVLoader().initialize();

    const Anglers = new MMKVLoader().initialize();
    const [Maxanglers, setAnglers] = useMMKVStorage("Maxanglers", Anglers, '');

    const Deposit = new MMKVLoader().initialize();
    const [depo, setDeposit] = useMMKVStorage("depo", Deposit, '');

    const pricePerWeek = new MMKVLoader().initialize();
    const [PricePerWeek, setPricePerWeek] = useMMKVStorage("ppw", pricePerWeek, '');

    const Fmonth = new MMKVLoader().initialize();
    const [fmonth, setFmonth] = useMMKVStorage("fmonth", Fmonth, '');

    const route = useRoute();
    const { id } = route.params;

    const getApidata = async () => {

        const url = `http://65.1.214.43:3307/api/lake/v1/get/${id}?StartDate=2023-05-09`;

        let token = MMKV.getItem('Mytoken');
        let res = await axios.get(url, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"],
            },
        });
        setLakesDetails(res.data.data);
        const Maxanglers = res.data.data.anglers;

        Anglers.setInt('Maxanglers', Maxanglers);
        setAnglers(Maxanglers);

        // Deposit
        const Depo = res.data.data.deposit;
        Deposit.setInt("DEPOSIT", Depo);
        setDeposit(Depo);

        //Price per week
        const priceWeek = res.data.data.pricePerWeek;
        pricePerWeek.setInt("PRICEPERWEEK", priceWeek);
        setPricePerWeek(priceWeek);


    }

    const getCalender = async () => {
        const url = `http://65.1.214.43:3307/api/transactions/v1/counts/${id}?StartDate=${fmonth}`;

        let token = MMKV.getItem('Mytoken');

        try {
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: 'Bearer ' + token["_j"],
                },
            });
            if (response.data) {
                let calenderdata = response.data.data;
                setCalender(calenderdata);

                if (calenderdata.results[0] == null) {
                    // showMessage({
                    //     description: 'Lake is not booked yet!!!',
                    //     message: "ERROR",
                    //     type: 'danger',
                    //     duration: 1000,
                    // });
                } else {
                    await handleCalenderData(calenderdata, setMarkedDates);
                    const results = response.data.results;
                }
            } else {
                showMessage({
                    description: 'Response data not found',
                    message: "ERROR",
                    type: 'danger',
                    duration: 1000,
                });
            }
        } catch (error) {
            // console.error(error);
        }
    };

    const addSevenDays = (date) => {

        const selectedDate = parseISO(date);
        const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 6 });
        const endDate = addDays(startOfWeekDate, 7);

        const dates = [];
        let currentDate = startOfWeekDate;
        while (currentDate <= endDate) {
            dates.push(format(currentDate, 'yyyy-MM-dd'));
            currentDate = addDays(currentDate, 1);
        }

        return dates;

    };

    const handleDatePress = (date) => {
        const formattedDate = format(parseISO(date.dateString), 'yyyy-MM-dd');

        if (markedDates[formattedDate] && markedDates[formattedDate].selectedColor === '#E70808') {
            showMessage({
                description: "No anglers available for the selected date",
                message: "ERROR",
                type: 'danger',
                duration: 2000,

            });
        } else {

            const newDate = addSevenDays(date.dateString);
            const updatedMarkedDates = {};
            for (const date of newDate) {
                updatedMarkedDates[date] = { selected: true, selectedColor: '#FFD700', selectedTextColor: 'black' };
            }
            setselectedDates(updatedMarkedDates);
        }
    };

    const handleMonthChange = (month) => {
        setIsLoading(true)
        const nextMonth = month.dateString.slice(0, 7);
        const firstDateNextMonth = new Date(nextMonth + '-01');

        Fmonth.setItem("first", firstDateNextMonth.toISOString());
        setFmonth(firstDateNextMonth);
        setIsLoading(false)

    };

    const isFav = async () => {
        const MMKV = new MMKVLoader().initialize();
        let token = MMKV.getItem('Mytoken');

        const url = 'http://65.1.214.43:3307/api/lake/v1/favourite';
        var data = {
            "lakeID": id,
            "isFavourite": 1
        }
        // console.log(data);

        let res = await axios.post(url, data, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"],
            },
        }).catch(error => {
            return error.response;
        });


        let error = res.data.data.message;
        if (res.data.statusCode == 201) {
            showMessage({
                message: "Lake liked successfully",
                type: "success",
                duration: 1000,
            });

            props.navigation.navigate("Favourites", { id })
        } else {
            showMessage({
                message: "ERROR",
                type: "danger",
                duration: 1000,
                description: `${error}`
            });
        }
    }

    useEffect(() => {
        getApidata();
        getCalender();
    }, [fmonth])


    const gotoHome1 = () => {
        props.navigation.navigate("Home1");
    }

    const gotoFavourites = () => {
        props.navigation.navigate("Favourites");
    }

    const gotoBookingPage = () => {
        props.navigation.navigate("BookingPage", { id });
    }

    const initialRegion = {
        latitude: 50.951290000000001,
        longitude: 1.858686,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const renderCustomArrow = (direction) => {
        return (
            <View style={{ alignSelf: 'flex-end' }}>
                {direction === 'left' ? (
                    <MaterialIcons name="arrow-back-ios" size={20} color="#cccccc" />
                ) : (
                    <MaterialIcons name="arrow-forward-ios" size={20} color="#cccccc" />
                )}
            </View>
        );
    };

    const placeholderImagePath = require('./image_loading.jpg');

    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View>

                    {/* Image */}
                    <View style={{ marginTop: 0 }}>
                        {lakesdetails.thumbUrl !== undefined && lakesdetails.thumbUrl !== "undefined" ? (
                            <ImageBackground source={{ uri: lakesdetails.thumbUrl }} style={styles.img}>
                                <TouchableOpacity onPress={gotoHome1}>
                                    <Image source={require('./Backarrow.png')} style={{ height: 40, width: 40, margin: 20 }} />
                                </TouchableOpacity>
                            </ImageBackground>
                        ) : (
                            <ImageBackground source={placeholderImagePath} style={styles.img}>
                                <TouchableOpacity onPress={gotoHome1}>
                                    <Image source={require('./Backarrow.png')} style={{ height: 40, width: 40, margin: 20 }} />
                                </TouchableOpacity>
                            </ImageBackground>
                        )}
                    </View>

                    {/* Lake Name - Heart Pic */}
                    <View style={{ flexDirection: 'column' }}>

                        <View style={{ flexDirection: 'column', marginLeft: 10 }}>

                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text style={styles.itemtxt}>{lakesdetails.lakeName}</Text>
                                <Pressable style={styles.like} onPress={isFav}>
                                    <Icon name="heart-o" size={22} color="#f5f5f5" />
                                </Pressable>
                            </View>
                        </View>

                        <View style={{ backgroundColor: '#101010', borderRadius: 10, marginTop: 30, marginLeft: 10, width: "95%", height: 105 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.itemtxt4}>Lake Size: {lakesdetails.size} Acres</Text>
                                <Text style={styles.itemtxt5}>Price per week: $ {lakesdetails.pricePerWeek}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.itemtxt4}>Anglers: {lakesdetails.anglers} Max</Text>
                                <Text style={styles.itemtxt5}>           Deposit Price: $ {lakesdetails.deposit}</Text>
                            </View>
                        </View>

                    </View>

                    {/* Lake Description */}
                    <View>
                        <Text style={styles.itemtxt2}>{lakesdetails.info}</Text>
                    </View>

                    {/* Lake Rules */}
                    <View style={{ width: '100%', height: 150 }}>
                        <Text style={styles.rule}>Lake Rule</Text>
                        <Text style={styles.rule2}>{lakesdetails.rules}</Text>
                    </View>

                    {/* Lake Location */}
                    <View>
                        <Text style={styles.rule5}>Lake location</Text>
                    </View>

                    {/* Map */}
                    <View style={styles.mapContainer}>
                        <MapView
                            initialRegion={initialRegion}
                            style={styles.map}
                        >
                            <Marker
                                coordinate={{
                                    latitude: initialRegion.latitude,
                                    longitude: initialRegion.longitude,
                                }}
                                title="My Location">
                                <Image
                                    source={require('./location.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            </Marker>
                        </MapView>


                    </View>

                    {/* Lake Availability ~ Calendar*/}
                    {isLoading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#4DED75" />
                        </View>

                    ) : (
                        <View>
                            <Text style={styles.rule6}>Lake availibility</Text>
                            <Calendar
                                firstDay={0}
                                hideExtraDays={true}
                                onDayPress={handleDatePress}
                                onMonthChange={handleMonthChange}

                                theme={{
                                    calendarBackground: 'transparent',
                                    todayBackgroundColor: '#101010',
                                    dayTextColor: '#cccccc',
                                    todayTextColor: 'green',
                                    monthTextColor: '#cccccc',
                                    arrowColor: '#cccccc',
                                    textMonthFontFamily: 'sf-pro',
                                    textDayHeaderFontFamily: 'sf-pro',
                                    textDayFontFamily: 'audiowide_regular',

                                }}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    marginTop: 50
                                }}
                                markedDates={{ ...markedDates, ...selectedDates }}
                                renderArrow={renderCustomArrow}




                            />
                        </View>

                    )
                    }

                    {/* Buttons */}
                    <View style={{ flexDirection: 'row', marginTop: 420, alignItems: 'center' }}>
                        <View style={styles.round}></View>
                        <Text style={{ color: '#ffffff', fontSize: 14, marginLeft: 10, fontFamily: 'sf_pro' }}>No bookings</Text>
                        <View style={styles.round1}></View>
                        <Text style={{ color: '#4DED75', fontSize: 14, marginLeft: 10, fontFamily: 'sf_pro' }}>My bookings</Text>
                        <View style={styles.round2}></View>
                        <Text style={{ color: '#D97908', fontSize: 14, marginLeft: 10, fontFamily: 'sf_pro' }}>Partial booked</Text>

                    </View>

                    {/* Buttons */}
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <View style={styles.round3}></View>
                        <Text style={{ color: '#E70808', fontSize: 14, marginLeft: 10, fontFamily: 'sf_pro' }}>Fully booked</Text>
                    </View>



                </View >
            </ScrollView >
            {/* Button - Book Lake */}
            < View style={{ marginTop: 20, backgroundColor: '#101010', width: '100%' }}>
                <TouchableOpacity style={styles.btn} onPress={gotoBookingPage}>
                    <Text style={styles.btntxt} >Book lake</Text>
                </TouchableOpacity>
            </View >
        </View >


    )
}

const styles = StyleSheet.create({
    img: {
        height: 300,
        width: "100%",

    },
    mapContainer: {
        width: '95%',
        height: 220,
        marginLeft: 10,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10
    },
    customHeader: {
        fontSize: 18,
        fontFamily: 'sf-pro',
        fontWeight: '600',
        color: '#CCCCCC',
        marginLeft: 10,
        marginTop: 20
    },

    map: {
        flex: 1,
    },
    itemtxt4: {
        fontSize: 16,
        fontFamily: 'sf-pro',
        fontWeight: '600',
        color: '#CCCCCC',
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: 20

    },
    itemtxt5: {
        fontSize: 16,
        fontFamily: 'sf-pro',
        fontWeight: '600',
        color: '#CCCCCC',
        marginLeft: 50,
        marginTop: 20

    },
    itemtxt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#CCCCCC',
        textTransform: 'uppercase',
        position: 'absolute',
        marginLeft: 10
    },
    itemtxt3: {
        fontSize: 18,
        fontFamily: 'sf-pro',
        fontWeight: 600,
        color: '#CCCCCC',
        paddingTop: 10,
        paddingBottom: 5,
    },
    like: {
        height: 25.8,
        width: 29.2,
        marginLeft: 340
    },
    itemtxt2: {
        fontSize: 18,
        fontFamily: 'sf-pro',
        fontWeight: 600,
        color: '#CCCCCC',
        marginTop: 20,
        marginLeft: 15
    },
    rule2: {
        fontSize: 18,
        fontFamily: 'sf-pro',
        fontWeight: 600,
        color: '#CCCCCC',
        marginTop: 50,
        position: 'absolute',
        marginLeft: 15
    },
    rule: {
        fontSize: 22,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#4DED75',
        textTransform: 'uppercase',
        marginLeft: 15,
        marginTop: 20
    },
    rule5: {
        fontSize: 22,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#4DED75',
        textTransform: 'uppercase',
        marginLeft: 15,

    },
    rule6: {
        fontSize: 22,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#4DED75',
        textTransform: 'uppercase',
        position: 'absolute',
        marginLeft: 15,
        marginTop: 20

    },
    btn: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 10,
        width: '90%',
        marginTop: 25.5,
        display: 'flex',
        borderRadius: 4,
        marginLeft: 20,
        marginBottom: 20
    },
    btntxt: {

        fontSize: 18,
        color: 'black',
        fontWeight: 400,
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'audiowide_regular',

    },
    round2: {
        backgroundColor: '#D97908',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 20
    },
    round1: {
        backgroundColor: '#4DED75',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 20
    },
    round: {
        backgroundColor: '#ffffff',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 20
    },
    round3: {
        backgroundColor: '#E70808',
        width: 10,
        height: 10,
        margintop: 695,
        borderRadius: 20,
        marginLeft: 20
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },


})

export default Booking;