import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MMKVLoader } from 'react-native-mmkv-storage';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import { TextInput } from 'react-native-paper';


const EditProfile = (props) => {

    const [fname1, setFullname] = useState('');
    const [fnameError, setFullnameError] = useState('');
    const [no1, setphno] = useState('');
    const [noError, setPhnoError] = useState('');

    const [isLoading, setIsLoading] = useState(false);


    const MMKV = new MMKVLoader().initialize();
    let token = MMKV.getItem('Mytoken');

    // Getting user Id.
    const uid = new MMKVLoader().initialize();
    const userId = uid.getInt('userid');

    // getting Full name
    const fulllname = new MMKVLoader().initialize();
    const fullname = fulllname.getItem('fullname'); // Assuming 'fullname' is an object

    const name = fullname["_j"] ? fullname["_j"].name : ''; // Access the 'name' property

    // getting mobilenumber
    const phno = new MMKVLoader().initialize();
    const mobilenumber = phno.getItem('mobilenumber');

    const validateFields = () => {
        let isValid = true;

        // Validate Fullname
        if (!fname1) {
            setFullnameError('Fullname is required');
            isValid = false;
        } else {
            setFullnameError('');
        }


        // Validate Mobile Number
        if (!no1) {
            setPhnoError('Mobile number is required');
            isValid = false;
        } else if (!/^\d+$/.test(no1)) {
            setPhnoError('Mobile number should contain only numbers');
            isValid = false;
        } else if (no1.length !== 10) {
            setPhnoError('Mobile number should be exactly 10 digits');
            isValid = false;
        }
        else {
            setPhnoError('');
        }

        return isValid;
    };


    const editprofile = async () => {
        setIsLoading(true)
        if (!validateFields()) {
            return;
        }
        const url = `http://65.1.214.43:3307/api/users/v1/updateprofile/${userId}`;
        var data = {
            "fullName": fname1,
            "mobileNumber": no1,
            "countryCode": "91"
        }
        let result = await axios.put(url, data, {
            headers: {
                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"]
            }
        }).catch(error => {
            return error.response;
        });

        const sT = result.data.statusCode;
        const error = result.data.data.message;
        if (sT == 200) {
            showMessage({
                message: "SUCCESS",
                type: "success",
                duration: 1000,
                description: `${error}`
            });
            props.navigation.navigate("Home1", fname1, no1);

            fulllname.setItem("fullname", fname1);
            phno.setItem("mobilenumber", no1)

        }
        else {
            showMessage({
                message: "ERROR",
                type: "danger",
                duration: 1000,
                description: `${error}`
            });
        }
        setIsLoading(false)


    }

    const gotoProfile = () => {
        props.navigation.navigate("Profile");
    }


    useEffect(() => {
        setFullname(fullname["_j"].toString()); // Convert fullname to string and set it as the initial value of fname1
        setphno(mobilenumber["_j"].toString());
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>

            {/*  Header */}
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={gotoProfile}>
                    <Image source={require('./arrow.png')} style={{ height: 15, width: 20, marginTop: 15, }} />
                </TouchableOpacity>

                <Text style={styles.txt}>EDIT PROFILE</Text>
            </View>

            {/*  Data  */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#4DED75" />
                </View>

            ) : (
                <View style={{ marginTop: 50, }}>

                    {/* {/ FullName /} */}
                    <View>
                        <Text style={styles.tagline}>Fullname</Text>
                        <TextInput
                            placeholder='Ex. John Deo'
                            style={styles.input1}
                            onChangeText={(text) => setFullname(text)}
                            value={fname1}
                            placeholderTextColor={'#999999'}
                            cursorColor={'#999999'}
                            activeUnderlineColor='#999999'
                            textColor='#cccccc'

                            right={
                                <TextInput.Icon icon={"account-outline"}
                                    iconColor='#999999' />
                            }
                        />
                        {fnameError ? <Text style={styles.errorText}>{fnameError}</Text> : null}
                    </View>

                    {/* Mobile number */}
                    <View>
                        <Text style={styles.tagline}>Mobile Number</Text>
                        <TextInput
                            placeholder='Ex. 1234567890'
                            style={styles.input1}
                            placeholderTextColor='#999999'
                            onChangeText={(text) => {
                                if (text.length <= 10) {
                                    setphno(text);

                                }
                            }}
                            value={no1}
                            keyboardType='numeric'
                            cursorColor={'#999999'}
                            activeUnderlineColor='#999999'
                            textColor='#cccccc'
                            right={
                                <TextInput.Icon icon={"cellphone"}
                                    iconColor='#999999' />
                            }
                        />
                        {noError ? <Text style={styles.errorText}>{noError}</Text> : null}
                    </View>

                </View>
            )}


            {/*  BUTTON  */}
            <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, paddingLeft: 20 }}>
                <TouchableOpacity style={styles.btn} onPress={editprofile}>
                    <Text style={styles.btntxt} >UPDATE PROFILE</Text>
                </TouchableOpacity>

            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    txt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        color: '#ffffff',
        fontWeight: 400,
        marginTop: 10,
        display: "flex",
        marginLeft: 90,
    },
    input1: {
        backgroundColor: '#101010',
        opacity: 0.9,
        borderRadius: 6,
        color: 'white',
        fontSize: 18,
        width: 350,
        height: 43,
        fontFamily: 'sf-pro',
    },
    tagline: {
        color: '#CCCCCC',
        fontSize: 15,
        fontWeight: 400,
        position: 'relative',
        paddingTop: 16,
        fontFamily: 'sf-pro',
        paddingBottom: 10,

    },
    btn: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 10,
        width: 350,
        display: 'flex',
        borderRadius: 4,
        marginBottom: 20,

    },
    btntxt: {

        fontSize: 18,
        color: 'black',
        fontWeight: 400,
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'audiowide_regular',

    },
    errorText: {
        color: 'red',
        fontFamily: 'sf-pro',

    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default EditProfile;