import React, { Component, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Image, ScrollView, ImageBackground, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome'
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import axios from 'axios';
import { format, addDays, parseISO, startOfWeek } from 'date-fns';
import { TextInput } from 'react-native-paper';


const Userbookingpage = (props) => {

    const [lakes, setLakes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isLoading, setIsLoading] = useState(false);


    const MMKV = new MMKVLoader().initialize();

    //  Getting User Id
    const uid = new MMKVLoader().initialize();
    const userId = uid.getInt('userid');

    const getApidata = async (query = '') => {
        setIsLoading(true)
        const url = `http://65.1.214.43:3307/api/transactions/v1/${userId}?pagination=yes&page=1&limit=10&search=${query}`;

        let token = MMKV.getItem('Mytoken');

        let res = await axios.get(url, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"],
            },
        });

        // Filter the lake data based on the search query
        const filteredLakes = res.data.data.filter(lake =>
            lake.lakeName && lake.lakeName.toLowerCase().includes(query.toLowerCase())
        );

        setLakes(filteredLakes);
        setIsLoading(false)
    }

    useEffect(() => {
        getApidata();
    }, [])

    const handleSearch = (query) => {
        setSearchQuery(query);
        getApidata(query);
    };

    return (

        <View style={{ flex: 1, }}>

            {/* Header */}

            <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center' }}>
                <Image source={require('./logo.png')} style={{ height: 40, width: 33, marginRight: 15 }} />
                <Text style={styles.laketxt}>Lake Link</Text>
            </View>

            {/* Search Bar */}
            <View style={{ backgroundColor: '#101010', flexDirection: 'row', marginTop: 10, width: '99%', marginLeft: 2 }}>
                <View style={{ padding: 10 }}>
                    <TextInput
                        placeholder='Search Here...'
                        placeholderTextColor={'#CCCCCC'}
                        style={styles.inputtxt}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        cursorColor={'#CCCCCC'}
                        activeUnderlineColor='#CCCCCC'
                        textColor='#CCCCCC'
                        left={
                            <TextInput.Icon icon={"magnify"} iconColor='#CCCCCC' />
                        }
                    />


                </View>
                {/* <Icon name="sliders" size={29} color="white" style={{ marginTop: 15, marginRight: 10 }} /> */}
            </View>

            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4DED75" />
                </View>

            ) : (
                <FlatList
                    data={lakes}
                    renderItem={({ item }) => <LakeData item={item} navigation={props.navigation} />}
                    style={{ padding: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

        </View>

    )
}

const LakeData = (props) => {
    const item = props.item;
    const id = item.lakeID;

    const deposit = item.totalDeposit;
    const totalAmount = item.totalAmount;
    const startdate = format(new Date(item.startDate), 'dd MMM yyyy');
    const enddate = format(new Date(item.endDate), 'dd MMM yyyy');

    return (
        <View style={{ backgroundColor: '#101010', flexDirection: 'row', marginTop: 10, width: 370, height: 124, borderRadius: 8 }}>

            {item.thumbUrl !== "undefined" ? (
                <Image style={styles.item} source={{ uri: item.thumbUrl }} />
            ) : (
                <Image style={styles.item} source={placeholderImagePath} />
            )}

            <View style={{ flexDirection: 'column', paddingLeft: 16, paddingTop: 6 }}>

                <Text style={styles.itemtxt}>{item.lakeName}</Text>
                <Text style={styles.itemtxt2}>Date: {startdate} to {enddate}</Text>
                <Text style={styles.itemtxt3}>Anglers: {item.anglersBooked}</Text>
                <Text style={styles.itemtxt4}>Total Deposit: ${item.totalDeposit}</Text>
                <Text style={styles.itemtxt4}>Remaining amount: ${totalAmount - deposit}</Text>

            </View>
        </View>

    )
}

const styles = StyleSheet.create({

    laketxt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        display: 'flex',

    },
    inputtxt: {
        borderColor: 'black',
        fontFamily: 'sf-pro',
        width: 355,
        height: 43,
        borderRadius: 4,
        backgroundColor: 'black',
        color: '#CCCCCC',
        paddingLeft: 10,
        fontSize: 16,
    },

    imageStyle: {
        paddingLeft: 5,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        backgroundColor: 'black'
    },
    item: {
        height: 124,
        width: 161,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    itemtxt: {
        fontSize: 15,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#F5F5F5',
        textTransform: 'uppercase',
        paddingBottom: 3,
        paddingTop: 10

    },
    itemtxt2: {
        fontSize: 12,
        fontFamily: 'sf-pro',
        fontWeight: 400,
        color: '#CCCCCC',
        paddingTop: 3,
    },
    itemtxt4: {
        fontSize: 12,
        fontFamily: 'sf-pro',
        fontWeight: 500,
        color: '#CCCCCC',

    },
    itemtxt3: {
        fontSize: 12,
        fontFamily: 'sf-pro',
        fontWeight: 500,
        color: '#CCCCCC',


    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})


export default Userbookingpage;