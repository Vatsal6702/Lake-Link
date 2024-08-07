import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import BookingCalenderData from './BookingCalender';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { format, addDays, parseISO, startOfWeek } from 'date-fns';
import { showMessage } from 'react-native-flash-message';
import { TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const BookingPage = (props) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [calender, setCalender] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDates, setselectedDates] = useState({});
    const [noofanglers, setNoofanglers] = useState('');
    const [userbooked, setUserbooked] = useState('');
    const [partiallybooked, setPartiallybooked] = useState('');
    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');
    const [errorflag, setErrorflag] = useState('');
    const updateErrorFlag = () => {
        setErrorflag(1);
    };

    const truthflag = () => {
        setErrorflag(0);
    }

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const [isLoading, setIsLoading] = useState(false);

    // Getting Price per week
    const pricePerWeek = new MMKVLoader().initialize();
    let pp = pricePerWeek.getInt("PRICEPERWEEK");

    const MMKV = new MMKVLoader().initialize();

    // Getting Id
    const route = useRoute();
    const { id } = route.params;

    // maximum anglers of lake
    const Anglers = new MMKVLoader().initialize();
    let Totalanglers = Anglers.getInt('Maxanglers');

    // Getting Deposit amount of lake
    const Deposit = new MMKVLoader().initialize();
    const deposit_amt = Deposit.getInt("DEPOSIT");

    // Getting the date of first month
    const Fmonth = new MMKVLoader().initialize();
    const [fmonth, setFmonth] = useMMKVStorage("fmonth", Fmonth, '');

    const gotoBooking = () => {
        props.navigation.navigate("Booking", { id });
    }

    const gotouserbookingpage = () => {
        props.navigation.navigate("UserBooking");
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
                    updateErrorFlag();
                } else {
                    await BookingCalenderData(calenderdata, setMarkedDates);
                    const results = response.data.results;
                    truthflag();
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

        setStartdate(format(startOfWeekDate, 'dd MMM yyyy'));
        setEnddate(format(endDate, 'dd MMM yyyy'));

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
            setPartiallybooked('');
            setUserbooked('');
            updateErrorFlag();

        }
        else if (markedDates[formattedDate] && markedDates[formattedDate].selectedColor === '#D97908') {
            const newDate = addSevenDays(date.dateString);

            const updatedMarkedDates = {};
            for (const date of newDate) {
                updatedMarkedDates[date] = { selected: true, selectedColor: 'yellow', selectedTextColor: 'black' };
            }
            setselectedDates(updatedMarkedDates);

            // Find the totalAnglersBooked for the selected week
            const selectedWeek = calender.results.find((week) => {
                const startDate = week.startDate;
                const endDate = addDays(parseISO(startDate), 6);
                return (
                    formattedDate >= format(parseISO(startDate), 'yyyy-MM-dd') &&
                    formattedDate <= format(endDate, 'yyyy-MM-dd')
                );
            });

            if (selectedWeek) {
                const totalAnglersBooked = selectedWeek.totalAnglersBooked;

                const Remaining = Totalanglers - totalAnglersBooked;


                if (noofanglers > Remaining) {
                    showMessage({
                        message: "ERROR",
                        type: "danger",
                        duration: 3000,
                        description: `You entered anglers greater than available.\n Available: ${Remaining}`
                    });
                    updateErrorFlag();
                } else {
                    truthflag();
                }

                // PartiallyBooked Anglers
                setPartiallybooked(totalAnglersBooked);
                setUserbooked('');

            } else {
                showMessage({
                    message: "No data available for the selected week",
                    type: 'danger',
                    duration: 3000,
                });
            }

        }
        else if (markedDates[formattedDate] && markedDates[formattedDate].selectedColor === '#4DED75') {
            const newDate = addSevenDays(date.dateString);

            const updatedMarkedDates = {};
            for (const date of newDate) {
                updatedMarkedDates[date] = { selected: true, selectedColor: 'yellow', selectedTextColor: 'black' };
            }
            setselectedDates(updatedMarkedDates);

            // Find the totalAnglersBooked for the selected week
            const selectedWeek = calender.results.find((week) => {
                const startDate = week.startDate;
                const endDate = addDays(parseISO(startDate), 6);
                return (
                    formattedDate >= format(parseISO(startDate), 'yyyy-MM-dd') &&
                    formattedDate <= format(endDate, 'yyyy-MM-dd')
                );
            });

            if (selectedWeek) {
                const totalAnglersBooked = selectedWeek.totalAnglersBooked;

                const Remaining = Totalanglers - totalAnglersBooked;

                if (noofanglers > Remaining) {
                    showMessage({
                        message: "ERROR",
                        type: "danger",
                        duration: 3000,
                        description: `You entered anglers greater than available.\n Available: ${Remaining}`
                    });
                    updateErrorFlag();

                } else {
                    truthflag();
                }

                // UserBooked Anglers
                const userBooked = selectedWeek.userBookedAnglers;

                setUserbooked(userBooked);
                setPartiallybooked('');

            } else {
                showMessage({
                    message: "No data available for the selected week",
                    type: 'danger',
                    duration: 3000,
                });
            }

        }
        else if (noofanglers > Totalanglers) {

            showMessage({
                message: "ERROR",
                type: "danger",
                duration: 5000,
                description: `You entered anglers greater than Toatal.\n Toatal :- ${Totalanglers}`
            });
            updateErrorFlag();
            truthflag();
            setPartiallybooked('');
            setUserbooked('');
        }

        else {
            const newDate = addSevenDays(date.dateString);
            const updatedMarkedDates = {};
            for (const date of newDate) {
                updatedMarkedDates[date] = { selected: true, selectedColor: '#FFD700', selectedTextColor: 'black' };
            }
            setselectedDates(updatedMarkedDates);
            setPartiallybooked('');
            setUserbooked('');
            truthflag();

        }
    };

    const handleNoOfAnglersChange = (value) => {
        // Check if the entered value is numeric
        if (!isNaN(value)) {
            // Convert the value to a number
            const anglers = value;

            // Check if the entered anglers is less than or equal to Totalanglers
            if (anglers <= Totalanglers) {
                // Set the number of anglers
                setNoofanglers(anglers);
            } else {
                showMessage({
                    type: "danger",
                    backgroundColor: '#ff4d4f', // Set the background color to redxx
                    message: 'Error',
                    description: `Entered anglers exceeds the maximum anglers : ${Totalanglers}`,
                    duration: 1000

                });
                updateErrorFlag();

                truthflag();


            }
        } else {
            // Display an error message if the entered value is not numeric
            showMessage({
                type: "danger",
                backgroundColor: '#ff4d4f', // Set the background color to red
                message: "Error",
                description: "Please enter a valid number of anglers.",
                type: "error",
            });
            setNoofanglers(''); // Clear the TextInput
            updateErrorFlag();
            truthflag();

        }
    };

    const bookLake = async () => {

        if (startdate == '') {
            showMessage({
                type: "danger",
                backgroundColor: '#ff4d4f',
                message: "Error",
                description: "Please Select the date for booking.",
                type: "error",
                duration: 2000
            });

        }
        else if (noofanglers == '') {
            showMessage({
                type: "danger",
                backgroundColor: '#ff4d4f',
                message: "Error",
                description: "Please Enter the no for Anglers.",
                type: "error",
                duration: 2000
            });
        }
        setIsLoading(true)
        if (selectedDates && noofanglers && errorflag == 0) {
            openModal();
        }
        setIsLoading(false)

        const url = `http://65.1.214.43:3307/api/lake/v1/booklake`;
        let token = MMKV.getItem('Mytoken');

        var data = {
            "lakeID": id,
            "anglersBooked": Number(noofanglers),
            "startDate": startdate,
            "endDate": enddate,
            "isOffline": 0,
            "exclusiveBooking": 0,
            "lastMinuteBooking": 0,
            "offlineUserName": "",
            "offlineUserPhoneNo": "",
            "offlineUserEmail": "",
            "paymentReference": "paymentReference",
            "totalAmount": noofanglers * pp,
            "totalDeposit": deposit_amt
        }


        let res = await axios.post(url, data, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"],
            },
        }).catch(error => {
            return error.response;
        });




    }


    const handleMonthChange = (month) => {
        const nextMonth = month.dateString.slice(0, 7);
        const firstDateNextMonth = new Date(nextMonth + '-01');

        Fmonth.setItem("first", firstDateNextMonth.toISOString());
        setFmonth(firstDateNextMonth);

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

    useEffect(() => {
        getCalender();
    }, [fmonth])

    return (

        <View style={{ flex: 1, padding: 10 }}>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Lake Booking */}
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={gotoBooking}>
                        <Image source={require('./arrow.png')} style={{ height: 15, width: 20, marginTop: 25, marginLeft: 10 }} />
                    </TouchableOpacity>
                    <Text style={styles.txt}>LAKE BOOKING</Text>
                </View>

                {/* Calendar*/}
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
                            marginTop: 5

                        }}
                        markedDates={{ ...markedDates, ...selectedDates }}
                        renderArrow={renderCustomArrow}
                    />
                </View>

                {/* Buttons */}
                <View style={{ flexDirection: 'row', marginTop: 360, alignItems: 'center' }}>
                    <View style={styles.round}></View>
                    <Text style={{ color: '#ffffff', fontSize: 14, marginLeft: 10, fontFamily: 'sf-pro' }}>No bookings</Text>
                    <View style={styles.round2}></View>
                    <Text style={{ color: '#D97908', fontSize: 14, marginLeft: 10, fontFamily: 'sf-pro' }}>Partial booked : {partiallybooked}</Text>
                    <View style={styles.round1}></View>
                    <Text style={{ color: '#4DED75', fontSize: 14, marginLeft: 10, fontFamily: 'sf-pro' }}>My bookings : {userbooked}</Text>


                </View>

                {/* Buttons */}
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                    <View style={styles.round3}></View>
                    <Text style={{ color: '#E70808', fontSize: 14, marginLeft: 10, fontFamily: 'sf-pro' }}>Fully booked</Text>
                </View>

                {/* Number Of Anglers */}
                <View style={{ flexDirection: 'row', paddingBottom: 90 }}>
                    <View style={{ height: 52, width: 350, flexDirection: 'row', marginTop: 40, borderRadius: 6, backgroundColor: '#101010', padding: 1 }}>

                        <View style={{ backgroundColor: 'black' }} >
                            <Text style={styles.txt1}>Number for anglers</Text>
                        </View>
                        <TextInput placeholder='3'
                            style={styles.input}
                            placeholderTextColor={'white'}
                            value={noofanglers}
                            onChangeText={handleNoOfAnglersChange}
                            cursorColor={'#999999'}
                            activeUnderlineColor='#999999'
                            textColor='#cccccc'
                            keyboardType='numeric'
                        />
                    </View>
                </View>

                {/* Total and PayNow Button */}
                <View style={{ flexDirection: 'row', backgroundColor: '#101010', width: "100%", paddingBottom: 20, bottom: 0 }}>
                    <Text style={styles.price1}>Total :<Text style={styles.price}> ${noofanglers * deposit_amt}.00</Text></Text>
                    <TouchableOpacity style={styles.btn} onPress={bookLake}>
                        {isLoading ? (
                            <ActivityIndicator size='small' color='black' />
                        ) : (
                            <Text style={styles.btntxt}>Pay Now!</Text>
                        )}

                    </TouchableOpacity>

                </View>

                {/* Confirmation Modal */}
                <Modal visible={showModal} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image source={require('./logo.png')} style={{ height: 128, width: 106 }} />
                            <Text style={{ color: '#F5F5F5', fontSize: 24, fontFamily: 'audiowide_regular', marginTop: 10, textTransform: 'uppercase' }}>Coagulation!</Text>
                            <Text style={{ color: '#999999', fontSize: 17, fontFamily: 'sf-pro', marginTop: 10, fontWeight: '500' }}>Your booking has been successfully done for {startdate} to {enddate}</Text>


                            <Pressable style={styles.btn1} onPress={gotouserbookingpage}>
                                <Text style={styles.btntxt} >Ok!</Text>
                            </Pressable>

                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    txt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        color: '#FFFFFF',
        fontWeight: 400,
        marginTop: 20,
        marginLeft: 90

    },
    rule6: {
        fontSize: 17,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#4DED75',
        textTransform: 'uppercase',
        marginTop: 60,
        marginLeft: 10

    },
    txt1: {
        fontSize: 15,
        fontFamily: 'audiowide_regular',
        color: '#999999',
        fontWeight: 500,
        paddingLeft: 20,
        width: 250,
        height: 43,
        marginTop: 13,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#101010',
        opacity: 0.9,
        fontSize: 18,
        width: 90,
        height: 43,
        fontFamily: 'sf-pro',
        textAlign: 'center',
    },
    price: {
        fontSize: 20,
        fontFamily: 'sf-pro',
        color: '#ffffff',
        fontWeight: 400,
        marginTop: 25
    },
    price1: {
        fontSize: 18,
        fontFamily: 'sf-pro',
        color: '#ffffff',
        fontWeight: 500,
        paddingLeft: 20,
        marginTop: 30
    },
    btn: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 10,
        paddingHorizontal: 28,
        marginTop: 20,
        marginLeft: 185,
        borderRadius: 4,
        position: 'absolute'
    },
    btntxt: {
        color: 'black',
        fontSize: 20,
        fontWeight: 500,
        alignSelf: 'center',
        fontFamily: 'audiowide_regular',
        textTransform: 'uppercase',
    },


    round2: {
        backgroundColor: '#D97908',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 15,

    },
    round: {
        backgroundColor: '#ffffff',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 10,

    },
    round1: {
        backgroundColor: '#4DED75',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 10,

    },
    round3: {
        backgroundColor: '#E70808',
        width: 10,
        height: 10,
        margintop: 700,
        borderRadius: 20,
        marginLeft: 10,

    },
    btn1: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 9,
        paddingHorizontal: 60,
        marginTop: 30,
        borderRadius: 4
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: 0.8
    },
    modalContent: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#101010',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },



})

export default BookingPage;
