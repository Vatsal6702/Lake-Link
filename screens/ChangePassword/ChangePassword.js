import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Image, ScrollView, ImageBackground, Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { isValid } from 'date-fns';

const ChangePassword = (props) => {

    const [oldpswd, setOldpswd] = useState('');
    
    const [pswd, setpswd] = useState('');
    const [cpswd, setCpswd] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [passwordVisible, setpasswordVisible] = useState(false);
    const [passwordVisible1, setpasswordVisible1] = useState(false);
    const [passwordVisible2, setpasswordVisible2] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const MMKV = new MMKVLoader().initialize();
    let token = MMKV.getItem('Mytoken');

    // Getting User ID.
    const uid = new MMKVLoader().initialize();
    const userId = uid.getInt('userid');

    const validateFields = () => {
        // Validate Password
        let isValid = true;

        if (!pswd) {

            showMessage({
                message: 'Invalid ',
                description: 'Password is required',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else if (pswd.length < 8) {
            showMessage({
                message: 'Invalid ',
                description: 'Password should be at least 8 characters long',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else {
            setPasswordError('');
        }

        // Validate Confirm Password
        if (!cpswd) {

            showMessage({
                message: 'Invalid ',
                description: 'Confirm Password is required',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else if (pswd !== cpswd) {

            showMessage({
                message: 'Invalid ',
                description: 'Confirm Password And Password is not equal',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else {
            setPasswordError('');
        }
        return isValid;
    }

    const changepassword = async () => {


        if (!validateFields()) {
            return;
        }
        setIsLoading(true)

        const url = `http://65.1.214.43:3307/api/users/v1/changepassword/${userId}`;
        var data = {
            "oldPassword": oldpswd,
            "password": pswd,
            "confirmPassword": cpswd
        }

        let result = await axios.put(url, data, {
            headers: {

                "Content-Type": 'application/json',
                Authorization: 'Bearer ' + token["_j"]
            }
        }).catch(error => {
            return error.response;

        });

        setIsLoading(false)

        const sT = result.data.statusCode;
        let error = result.data.message;

        if (sT == 200) {
            showMessage({
                message: "Password changed Successfully",
                type: "success",
                duration: 1000,
            });
            props.navigation.navigate("Login", oldpswd, pswd, cpswd);
            setOldpswd('');
            setpswd('');
            setCpswd('');
        }
        else {
            showMessage({
                message: "ERROR",
                type: "danger",
                duration: 1000,
                description: `${error}`
            });
        }


    }

    const gotoProfile = () => {
        props.navigation.navigate("Profile");
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>

            {/* {/ Header /} */}
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={gotoProfile}>
                    <Image source={require('./arrow.png')} style={{ height: 15, width: 20, marginTop: 15 }} />
                </TouchableOpacity>

                <Text style={styles.txt}>Change Password</Text>
            </View>

            {/* {/ Data /} */}
            <View style={{ marginTop: 50, }}>
                {/*  Old password  */}
                <View >
                    <Text style={styles.tagline}>Old Password</Text>

                    <TextInput placeholder='*******' placeholderTextColor={'#999999'} style={styles.input1}
                        onChangeText={(text) => setOldpswd(text)}
                        value={oldpswd}

                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        secureTextEntry={passwordVisible}
                        textColor='#cccccc'

                        right={
                            <TextInput.Icon
                                icon={passwordVisible ? "eye-off-outline" : "eye-outline"}
                                onPress={() => {
                                    setpasswordVisible(!passwordVisible)
                                    Keyboard.dismiss();
                                }}
                                iconColor='#999999' />}
                    />

                </View>

                {/*  New passoword  */}
                <View >
                    <Text style={styles.tagline}>New Password</Text>

                    <TextInput placeholder='*******' placeholderTextColor={'#999999'} style={styles.input1}
                        onChangeText={(text) => setpswd(text)}
                        value={pswd}

                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        secureTextEntry={passwordVisible1}
                        textColor='#cccccc'

                        right={
                            <TextInput.Icon
                                icon={passwordVisible1 ? "eye-off-outline" : "eye-outline"}
                                onPress={() => {
                                    setpasswordVisible1(!passwordVisible1)
                                    Keyboard.dismiss();
                                }}
                                iconColor='#999999' />}
                    />


                </View>

                {/*  Confirm Password  */}
                <View >
                    <Text style={styles.tagline}>Confirm Password</Text>

                    <TextInput placeholder='*******' placeholderTextColor={'#999999'} style={styles.input1}
                        onChangeText={(text) => setCpswd(text)}
                        value={cpswd}

                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        secureTextEntry={passwordVisible2}
                        textColor='#cccccc'


                        right={
                            <TextInput.Icon
                                icon={passwordVisible2 ? "eye-off-outline" : "eye-outline"}
                                onPress={() => {
                                    setpasswordVisible2(!passwordVisible2)
                                    Keyboard.dismiss();
                                }}
                                iconColor='#999999' />}
                    />

                </View>
            </View>

            {/* {/ BUTTON /} */}
            <View style={{ flexDirection: 'row', borderRadius: 20, position: 'absolute', bottom: 20, width: "95%", marginLeft: 25 }}>
                <TouchableOpacity style={styles.btn} onPress={changepassword}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <Text style={styles.btntxt} >update password</Text>
                    )}

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
        position: 'absolute',
        marginLeft: 65,
        textTransform: 'uppercase'

    },

    input1: {
        backgroundColor: '#101010',
        opacity: 0.9,
        borderRadius: 6,
        color: 'white',
        fontSize: 18,
        width: 340,
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
        marginBottom: 15,


    },
    btn: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 15,
        width: '100%',
        borderRadius: 6
    },
    btntxt: {
        color: 'black',
        fontSize: 18,
        fontWeight: 500,
        alignSelf: 'center',
        fontFamily: 'audiowide_regular',
        textTransform: 'uppercase',

    },
    errorText: {
        color: 'red',
        fontFamily: 'sf-pro',

    },

});

export default ChangePassword;