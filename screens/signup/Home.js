import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Pressable, Keyboard, ActivityIndicator } from 'react-native';
import { useMMKVStorage, MMKVLoader } from 'react-native-mmkv-storage';
import { TextInput, RadioButton } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import axiosInstance from '../axiosConfig';

const SignUp1 = (props) => {
    const MMKV = new MMKVLoader().initialize();
    const [AccessToken, setAccessToken] = useMMKVStorage("AccessToken", MMKV, '');

    const Uname = new MMKVLoader().initialize();
    const [username, setUserName] = useMMKVStorage("username", Uname, '');

    const [fname, setFullname] = useState('');
    const [fnameError, setFullnameError] = useState('');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [no, setphno] = useState('');
    const [noError, setPhnoError] = useState('');

    const [pswd, setpswd] = useState('');
    const [cpswd, setcpswd] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [passwordVisible, setpasswordVisible] = useState(false);
    const [cpasswordVisible, setCpasswordVisible] = useState(false);

    // const [selectedId, setSelectedId] = useState(null);
    // const [selectedId, setSelectedId] = useState('1');

    const [selectedValue, setSelectedValue] = useState(null);

    const fulllname = new MMKVLoader().initialize();
    const [fullname, setFullname1] = useMMKVStorage('fname', fulllname, '');

    const phno = new MMKVLoader().initialize();
    const [phonenumber, setPhonenumber] = useMMKVStorage('phno', phno, '');

    const [isLoading, setIsLoading] = useState(false);


    const validateFields = () => {
        let isValid = true;

        // Validate Fullname
        if (!fname) {
            showMessage({
                message: 'Invalid ',
                description: 'Fullname is required',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else {
            setFullnameError('');
        }

        // Validate Email
        if (!email) {
            showMessage({
                message: 'Invalid ',
                description: 'Email is required',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showMessage({
                message: 'Invalid email address',
                type: 'danger',
                duration: 3000,
                description:'Write in this format  Ex. mailto:abc123@gmail.com'
            });
            isValid = false;
        } else {
            setEmailError('');
        }

        // Validate Mobile Number
        if (!no) {
            showMessage({
                message: 'Invalid ',
                description: 'Mobile number is required',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else if (!/^\d+$/.test(no)) {

            showMessage({
                message: 'Invalid ',
                description: 'Mobile number should contain only numbers',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        } else if (no.length !== 10) {

            showMessage({
                message: 'Invalid ',
                description: 'Mobile number should be exactly 10 digits',
                type: 'danger',
                duration: 2000,
            });
            isValid = false;
        }
        else {
            setPhnoError('');
        }

        // Validate Password
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

        // Validate Radio Button
        if (!selectedValue) {
            // Assuming at least one radio button needs to be selected
            isValid = false;
        } else if (selectedValue === 'Owner') {
            showMessage({
                message: 'Invalid Selection',
                description: 'You can only select the "Customer" option.',
                type: 'danger',
                duration: 3000,
            });
            isValid = false;
        }

        return isValid;
    };

    const getAccessToken = async () => {

        if (!validateFields()) {
            return;
        }
        setIsLoading(true)

        const url = '/auth/v1/register';
        var data = {
            "fullName": fname,
            "email": email,
            "mobileNumber": no,
            "countryCode": "91",
            "roleType": "Customer",
            "password": pswd,
            "confirmPassword": cpswd,
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
            result = await axiosInstance.post(url, data, {
                headers: {
                    "Content-Type": 'application/json',
                    accept: 'application/json'
                }
            });
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                result = error.response;
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser
                // and an instance of http.ClientRequest in node.js
                console.log(error.request);
                // Handle request error
                return;
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                // Handle other errors
                return;
            }
        }
        setIsLoading(false)
        // console.log("Result :  - ",result);
        let response = result.data;
        console.log(response);

        let statusCode = result.data.statusCode;

        let error = result.data.message;

        let fullname = response.data.fullName;
        let mobileNumber = response.data.mobileNumber;

        if (statusCode == 201) {
            const aT = result.data.data.accessToken;
            let name = result.data.data.fullName;

            MMKV.setItem('Mytoken', aT);
            setAccessToken(aT);

            Uname.setItem('username', name);
            setUserName(name);

            fulllname.setItem('fullname', fullname);
            setFullname1(fullname);

            phno.setItem('mobilenumber', mobileNumber);
            setPhonenumber(mobileNumber);

            props.navigation.navigate("Home", fname, email, no, pswd, cpswd);

            setFullname('');
            setEmail('');
            setphno('');
            setpswd('');
            setcpswd('');
        } else if (statusCode == 409) {
            showMessage({
                description: `${error}`,
                message: "User already exists",
                type: 'danger',
                duration: 3000,
            });
        }

        else {
            showMessage({
                description: `${error}`,
                message: "ERROR",
                type: 'danger',
                duration: 3000,

            });

        }

    }

    const LoginPage = () => {
        props.navigation.navigate("Login");
    }

    useEffect(() => {
        setSelectedValue("Customer");
    }, []);


    const onPressRadioButton = (value) => {
        setSelectedValue(value);
        if (value === 'Owner') {
            showMessage({
                message: 'Invalid Selection',
                description: 'You can only select the "Customer" option.',
                type: 'danger',
                duration: 3000,
            });
        }
    };


    return (

        <View style={styles.main}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* SignUp Text  */}
                <View>
                    <Text style={styles.txt}>Signup</Text>
                </View>

                {/* SignUp Tagline  */}
                <View>
                    <Text style={styles.tagline}>Please signup to create a new account</Text>
                </View>

                {/*  FullName */}
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.tagline2}>Fullname</Text>
                    <TextInput
                        placeholder='Ex. John Deo'
                        style={styles.input}
                        onChangeText={(text) => setFullname(text)}
                        value={fname}
                        placeholderTextColor={'#999999'}
                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        textColor='#cccccc'

                        right={
                            <TextInput.Icon icon={"account-outline"}
                                iconColor='#999999' />
                        }
                    />
                   
                </View>

                {/*  Email  */}
                <View>
                    <Text style={styles.tagline2}>Email</Text>
                    <TextInput
                        placeholder='Ex. mailto:johndeo@example.com'
                        style={styles.input}
                        placeholderTextColor='#999999'
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        keyboardType='email-address'
                        cursorColor={'#cccccc'}
                        textColor='#cccccc'
                        activeUnderlineColor='#cccccc'
                        right={
                            <TextInput.Icon icon={"email-outline"}
                                iconColor='#999999' />
                        }
                    />
                    
                </View>

                {/*  Mobile Number  */}

                <View>

                    <Text style={styles.tagline2}>Mobile Number</Text>
                    <TextInput
                        placeholder='Ex. 1234567890'
                        style={styles.input}
                        placeholderTextColor='#999999'
                        onChangeText={(text) => {
                            if (text.length <= 10) {
                                setphno(text);
                            }
                        }}
                        value={no}
                        keyboardType='numeric'
                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        textColor='#cccccc'
                        right={
                            <TextInput.Icon icon={"cellphone"}
                                iconColor='#999999' />
                        }
                    />
                  
                </View>

                {/* Radio Button  */}
                <View style={{ marginTop: 10 }}>
                    <RadioButton.Group onValueChange={onPressRadioButton} value={selectedValue} >
                        <View style={styles.radioButtonContainer}>

                            <RadioButton.Item value="Owner" color="#4DED75" checked={selectedValue === "Owner"}  />
                            <Text style={styles.radioButtonText}>Owner</Text>

                            <RadioButton.Item value="Customer" color="#4DED75" checked={selectedValue === "Customer"} />
                            <Text style={styles.radioButtonText}>Customer</Text>
                        </View>
                    </RadioButton.Group>

                   
                </View>

                {/*  Password  */}
                <View >
                    <Text style={styles.tagline}>Password</Text>
                    <TextInput
                        placeholder='******'
                        style={styles.input}
                        placeholderTextColor='#999999'
                        secureTextEntry={passwordVisible}
                        onChangeText={(text) => setpswd(text)}
                        value={pswd}
                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        textColor='#cccccc'
                        right={<TextInput.Icon
                            icon={passwordVisible ? "eye-off-outline" : "eye-outline"}
                            onPress={() => {
                                setpasswordVisible(!passwordVisible)
                                Keyboard.dismiss();
                            }}
                            iconColor='#999999'

                        />}
                    />
                  
                </View>

                {/*  Confirm Password  */}
                <View>
                    <Text style={styles.tagline}>Confirm Password</Text>
                    <TextInput
                        placeholder='******'
                        style={styles.input}
                        placeholderTextColor='#999999'
                        secureTextEntry={cpasswordVisible}
                        onChangeText={(text) => setcpswd(text)}
                        value={cpswd}
                        cursorColor={'#999999'}
                        activeUnderlineColor='#999999'
                        textColor='#cccccc'
                        right={<TextInput.Icon
                            icon={cpasswordVisible ? "eye-off-outline" : "eye-outline"}
                            onPress={() => {
                                setCpasswordVisible(!cpasswordVisible)
                                Keyboard.dismiss();
                            }}

                            iconColor='#999999'
                        />}
                    />
                  
                </View>

                {/*  T&C  */}
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.tagline5}>
                        By signing up, you agree to our <Text style={styles.tagline1}>Terms conditions.</Text>
                    </Text>
                    <Text style={styles.tagline6}>
                        See how we use your data in our  <Text style={styles.tagline1}>Privacy policy.</Text>
                    </Text>
                </View>


                {/*  Sign Up Button  */}
                <View>
                    <TouchableOpacity style={styles.btn} onPress={getAccessToken}>
                        {isLoading ? (
                            <ActivityIndicator size='small' color='black' />
                        ) : (
                            <Text style={styles.btntxt}>Sign Up</Text>
                        )}

                    </TouchableOpacity>
                </View>

                {/*  Button Tagline  */}
                <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 10, marginTop: 10 }} >
                    <Pressable onPress={LoginPage}>
                        <Text style={styles.bottomtxt}>
                            I already have an account | <Text style={styles.bottomtxt1}>Signin</Text>
                        </Text>
                    </Pressable>
                </View>

            </ScrollView>

        </View>

    )
}

const styles = StyleSheet.create({
    main: {
        padding: 20,
        paddingTop: 25,
    },
    txt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        color: '#FFFFFF',
        fontWeight: 400,
        textTransform: 'uppercase',
        display: 'flex'
    },
    input: {
        backgroundColor: '#101010',
        opacity: 0.9,
        borderRadius: 4,
        color: '#cccccc',
        fontSize: 16,
        width: 360,
        height: 43,
        paddingTop: 10,
        fontFamily: 'sf-pro',
        marginTop: 4
    },
    btn: {
        elevation: 9,
        backgroundColor: '#4DED75',
        paddingVertical: 10,
        paddingHorizontal: '38%',
        marginTop: 5.5,
        display: 'flex',
        borderRadius: 4
    },
    btntxt: {
        color: 'black',
        fontSize: 18,
        fontWeight: 500,
        alignSelf: 'center',
        fontFamily: 'audiowide_regular',
        display: 'flex'
    },
    tagline: {
        color: '#999999',
        fontSize: 16,
        fontWeight: 400,
        display: 'flex',
        marginTop: 10,
        fontFamily: 'sf-pro',
        display: 'flex'
    },
    tagline1: {
        color: '#999999',
        fontSize: 16,
        fontWeight: 400,
        position: 'relative',
        textDecorationLine: 'underline',
        fontFamily: 'sf-pro',
    },
    tagline2: {
        color: '#cccccc',
        fontSize: 16,
        fontWeight: 400,
        display: 'flex',
        fontFamily: 'sf-pro',
        marginTop: 10.5,
        display: 'flex'
    },
    tagline5: {
        color: '#999999',
        fontSize: 14,
        fontWeight: 400,
        fontFamily: 'sf-pro',
        marginTop: 10,
        display: 'flex'
    },
    tagline6: {
        color: '#999999',
        fontSize: 14,
        fontWeight: 400,
        display: 'flex',
        fontFamily: 'sf-pro',
        marginBottom: 20
    },
    bottomtxt:
    {
        color: '#999999',
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'sf-pro',
        display: 'flex'
    },
    bottomtxt1:
    {
        color: '#4DED75',
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'sf-pro',
        display: 'flex'

    },
    errorText: {
        color: 'red',
        fontFamily: 'sf-pro'

    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },

    radioButtonText: {
        fontSize: 18,
        color:'#999999'
    },

});

export default SignUp1;