import axios from 'axios';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, Image, Alert, Pressable, Keyboard, ActivityIndicator } from 'react-native';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { TextInput } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';

const LoginScreen = (props) => {

    const MMKV = new MMKVLoader().initialize();
    const [AccessToken, setAcessToken] = useMMKVStorage("AccessToken", MMKV, '');

    const uid = new MMKVLoader().initialize();
    const [userid, setUserid] = useMMKVStorage("userid", uid, '');

    const fulllname = new MMKVLoader().initialize();
    const [fullname, setFullname1] = useMMKVStorage("fname", fulllname, '');

    const phno = new MMKVLoader().initialize();
    const [phonenumber, setPhonenumber] = useMMKVStorage("phno", phno, '');

    const [email, setEmail] = useState('');
    const [pswd, setpswd] = useState('');
    const [passwordVisible, setpasswordVisible] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    const validateEmail = () => {
        // Regular expression for email validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            showMessage({
                description: 'Please enter a valid email',
                message: "ERROR",
                type: 'danger',
                duration: 2000,
            });
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (pswd.length < 6) {
            showMessage({
                description: 'Password should be at least 6 characters long',
                message: "ERROR",
                type: 'danger',
                duration: 2000,
            });
            return false;
        }
        return true;
    };

    const getDynamicdata = async () => {
        if (!validateEmail() || !validatePassword()) {
            return;
        }
        setIsLoading(true)

        const url = 'http://65.1.214.43:3307/api/auth/v1/login';
        var data = {
            "email": email,
            "password": pswd,
            "authType": "Local",
            "appType": "App",
            "os": "android",
            "brand": "Samsung A50",
            "modelNo": "SM-A12E",
            "serialNumber": "SA4545as45a4",
            "versionNumber": "1.0",
            "latitude": 127.55545,
            "longitude": -7.5555454965
        }
        let result;
        try {
            result = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
            });
        } catch (error) {
            if (error.response === undefined) {
                showMessage({
                    description: 'Server not responding',
                    message: 'Error',
                    type: 'error',
                    duration: 2000,
                    backgroundColor: '#ff4d4f',
                });
                return;
            }
            result = error.response;
        }

       
        setIsLoading(false)

        let response = result?.data;
        let rt = response?.statusCode;
        let error = response?.message;

        if (rt == 201 && result.data.data.userID != null) {
            let aT = response.data.accessToken;
            let Uid = result.data.data.userID;

            let fullname = response.data.fullName;
            let mobileNumber = response.data.mobileNumber;

            fulllname.setItem('fullname', fullname);
            setFullname1(fullname);

            phno.setItem('mobilenumber', mobileNumber);
            setPhonenumber(mobileNumber);

            MMKV.setItem('Mytoken', aT);
            setAcessToken(aT);

            uid.setInt('userid', Uid);
            setUserid(Uid);

            props.navigation.navigate("Home", email, pswd)
            
            setEmail('');
            setpswd('');
        }
        else {
            // props.navigation.navigate("Signup1");
            showMessage({
                message: "ERROR",
                type: "danger",
                duration: 2000,
                description: `${error}`
            });
        }

    }

    const signup = () => {
        props.navigation.navigate("Signup1")

    }

    return (
        <View style={{ paddingTop: 20, flex: 1, padding: 20 }}>
            <Text style={styles.loginn}>Login</Text>
            <Text style={styles.signin}>Please sign in to continue</Text>

            {/* Email ID */}
            <View>
                <Text style={{ fontSize: 14, fontWeight: 400, color: '#CCCCCC', marginTop: 25.5, fontFamily: 'sf-pro', display: 'flex' }}>Email ID</Text>
                <TextInput placeholder='johndeo@hotmail.com'
                    style={styles.input}
                    placeholderTextColor={'#999999'}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    cursorColor={'#cccccc'}
                    textColor='#cccccc'
                    activeUnderlineColor='#cccccc'
                    right={
                        <TextInput.Icon icon={"email-outline"}
                            iconColor='#999999' />
                    }

                />

            </View>

            {/* Password */}
            <View>
                <Text style={{ fontSize: 14, fontWeight: 400, color: '#CCCCCC', fontFamily: 'sf-pro', marginTop: 20.5 }}>Password</Text>
                <TextInput
                    placeholder='******'
                    placeholderTextColor={'#999999'}
                    placeholderStyle={{ fontFamily: 'sf_pro' }}
                    style={styles.input1}
                    onChangeText={(text) => setpswd(text)}
                    value={pswd}
                    cursorColor={'#999999'}
                    activeUnderlineColor='#cccccc'
                    textColor='#cccccc'
                    secureTextEntry={passwordVisible}
                    right={<TextInput.Icon
                        icon={passwordVisible ? "eye-off-outline" : "eye-outline"}
                        onPress={() => {
                            setpasswordVisible(!passwordVisible)
                            Keyboard.dismiss();
                        }}
                        iconColor='#999999' />}
                />
            </View>

            {/* Forgot Password */}
            <View>
                <Text style={styles.fp} >Forgot Password?</Text>
            </View>

            {/* Login Button */}
            <View>
                <TouchableOpacity style={styles.btn} onPress={getDynamicdata} >
                    {isLoading ? (

                        <ActivityIndicator color='black' size='small' />
                    ) : (
                        <Text style={styles.btntxt}>Login</Text>
                    )}

                </TouchableOpacity>
            </View>

            {/* Below Text of Button  */}
            <View style={{ paddingTop: 8, paddingBottom: 8, marginTop: 10 }}>
                <Pressable onPress={signup}><Text style={styles.ydna}>You don’t have an account?<Text style={styles.ydha1}> Signup Free!</Text></Text></Pressable>
            </View>

            {/* Vector Image */}
            <View >
                <Image source={require('./Vector.png')} style={styles.img} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    loginn: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#FFFFFF',
        marginTop: 20,
        textTransform: 'uppercase',
        display: 'flex'

    },
    signin: {
        color: '#999999',
        fontWeight: 400,
        fontSize: 15,
        marginTop: 5,
        fontFamily: 'sf-pro',
        display: 'flex',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        fontFamily: 'sf-pro',
        height: 43,
        borderRadius: 4,
        backgroundColor: '#101010',
        color: '#999999',
        marginTop: 10.5,
        display: 'flex',

    },
    input1: {
        borderWidth: 1,
        borderColor: 'black',
        fontFamily: 'sf-pro',
        height: 43,
        borderRadius: 4,
        backgroundColor: '#101010',
        color: '#999999',
        display: 'flex',
        marginTop: 10.5

    },
    fp: {
        fontSize: 13,
        fontWeight: 400,
        color: '#CCCCCC',
        display: 'flex',
        alignItems: 'flex-end',
        marginLeft: 254,
        marginTop: 10.5,
        fontFamily: 'sf-pro',

    },
    btn: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 10,
        paddingHorizontal: '38%',
        marginTop: 25.5,
        display: 'flex',
        borderRadius: 4
    },
    btntxt: {

        fontSize: 18,
        color: 'black',
        fontWeight: 400,
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'audiowide_regular',

    },
    ydna: {
        color: '#999999',
        fontFamily: 'sf-pro',
        marginTop: 10,
        display: 'flex',
        alignSelf: 'center'
    },
    ydha1: {
        color: '#4DED75',
        fontFamily: 'sf-pro'
    },
    img: {
        height: 348,
        width: 390,
        display: 'flex',
        opacity: 0.7,
        marginTop: 10
    }
})

export default LoginScreen;