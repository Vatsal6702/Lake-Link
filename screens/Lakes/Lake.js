import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Pressable, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MMKVLoader } from 'react-native-mmkv-storage';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import { TextInput } from 'react-native-paper';


const Lake = (props) => {
    const [lakes, setLakes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const MMKV = new MMKVLoader().initialize();

    const [isLoading, setIsLoading] = useState(false);

    const getApidata = async (query = '') => {
        setIsLoading(true)
        const url = `http://65.1.214.43:3307/api/lake/v1/nearestlake?pagination=yes&page=1&limit=10&search=${query}`;

        let token = MMKV.getItem('Mytoken');

        let res = await axios.get(url, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"],
            },
        });

        // Filter the lake data based on the search query
        const filteredLakes = res.data.data.filter(lake =>
            lake.lakeName.toLowerCase().includes(query.toLowerCase())
        );

        setLakes(filteredLakes);
        setIsLoading(false)
    };

    useEffect(() => {
        getApidata();
    }, [])

    const handleSearch = (query) => {
        setSearchQuery(query);
        getApidata(query);
    };

    const gotoLake = () => {
        props.navigation.navigate("Home1");
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <Pressable onPress={gotoLake}>
                <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'center' }}>
                    <Image source={require('./logo.png')} style={{ height: 40, width: 33, marginRight: 15 }} />
                    <Text style={styles.laketxt}>Lake Link</Text>
                </View>
            </Pressable>

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
                    showsVerticalScrollIndicator={false}
                />
            )}




        </View>
    )
}

const LakeData = (props) => {
    const item = props.item;
    const id = item.lakeID;

    const lakeDetails = (id) => {
        props.navigation.navigate("Booking", { id });
    }

    const isFav = async () => {
        const MMKV = new MMKVLoader().initialize();
        let token = MMKV.getItem('Mytoken');
        const url = 'http://65.1.214.43:3307/api/lake/v1/favourite';
        var data = {
            "lakeID": id,
            "isFavourite": 1
        }

        let res = await axios.post(url, data, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"]
            }
        })

        let error = res.data.data.message
        if (res.data.statusCode == 201) {
            showMessage({
                message: "SUCCESS",
                type: "success",
                duration: 2000,
            });
            props.navigation.navigate("Favourites", { id })
        }
        else {
            showMessage({
                message: "ERROR",
                type: "danger",
                duration: 2000,
                description: `${error}`
            });
        }
    }

    const placeholderImagePath = require('./image_loading.jpg');

    return (
        <Pressable onPress={() => lakeDetails(id)}>
            <View style={{ paddingLeft: 15, paddingRight: 15, marginTop: 10 }}>
                <View style={{ backgroundColor: '#101010', flexDirection: 'column', borderRadius: 15, marginTop: 10, width: '100%' }}>
                    {item.thumbUrl !== "undefined" ? (
                        <Image style={styles.item} source={{ uri: item.thumbUrl }} />
                    ) : (
                        <Image style={styles.item} source={placeholderImagePath} />
                    )}

                    {/* <Image source={{ uri: item.thumbUrl }} style={styles.item} /> */}

                    <View style={{ flexDirection: 'column', marginLeft: 10 }}>

                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={styles.itemtxt}>{item.lakeName}</Text>
                            <Pressable style={styles.like} onPress={isFav}>
                                <Icon name="heart-o" size={22} color="#f5f5f5" />
                            </Pressable>
                        </View>

                        <Text style={styles.itemtxt2}>{item.address}</Text>
                        <Text style={styles.itemtxt3}>Size: {item.size} Acres<Text>    Anglers: {item.anglers}</Text>    Price Per Week: $<Text>{item.pricePerWeek}</Text></Text>
                    </View>

                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({

    laketxt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#CCCCCC',
        textTransform: 'uppercase',
        display: 'flex',
    },
    inputtxt: {
        borderWidth: 1,
        borderColor: 'black',
        fontFamily: 'sf-pro',
        width: 355,
        height: 43,
        borderRadius: 10,
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
        height: 140,
        width: 363,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    itemtxt: {
        fontSize: 18,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#CCCCCC',
        textTransform: 'uppercase',
        position: 'absolute',

    },
    itemtxt2: {
        fontSize: 16,
        fontFamily: 'sf-pro',
        fontWeight: 500,
        color: '#CCCCCC',
        marginTop: 45,
        position: 'absolute',

    },

    itemtxt3: {
        fontSize: 16,
        fontFamily: 'sf-pro',
        fontWeight: 500,
        color: '#CCCCCC',
        marginTop: 75,
        marginBottom: 20,


    },
    like: {

        position: 'absolute',
        marginLeft: 320

    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Lake;