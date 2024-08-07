import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button, TouchableOpacity, Image, ScrollView, Pressable, Modal } from 'react-native';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const Profile = (props) => {

    const MMKV = new MMKVLoader().initialize();
    let token = MMKV.getItem('Mytoken');

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    // Getting User Id.
    const uid = new MMKVLoader().initialize();
    const userId = uid.getInt('userid');

    const getLogout = async () => {
        const url = `http://65.1.214.43:3307/api/users/v1/logout`;
        var data ={}

            let res = await axios.post(url,data, {
                headers: {
                    accept: '*/*',
                    Authorization: 'Bearer ' + token["_j"],
                }
            });
            
            let error2 = res.data.data.message;
            props.navigation.navigate("Login");
            showMessage({
                message: "SUCCESS",
                type: "success",
                duration: 2000,
                description: `${error2}`,
            });
        
       
       
        
    }

    const deleteUser = () => {
        openModal();
    };

    const confirmDelete = async () => {
        closeModal(); // Close the modal

        try {
            const url = `http://65.1.214.43:3307/api/users/v1/deleteprofile/${userId}`;
            const result = await axios.delete(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token["_j"],
                },
            });

            const error = result.data.message;
            showMessage({
                message: "SUCCESS",
                type: "success",
                duration: 1000,
                description: `${error}`,
            });
            props.navigation.navigate("Signup1"); // Navigate to signup page

        } catch (error) {
            showMessage({
                message: "ERROR",
                type: "error",
                duration: 1000,
                description: "ERROR",

            });
           
        }
    };


    const gotoEditProfile = () => {
        props.navigation.navigate("EditProfile");
    }

    const gotoChangePassword = () => {
        props.navigation.navigate("ChangePassword");
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>

            {/* Header */}
            <Pressable>
                <View style={{ flexDirection: 'row', paddingTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('./logo.png')} style={{ height: 40, width: 33 }} />
                    <Text style={styles.laketxt}>Lake Link</Text>
                </View>
            </Pressable>

            {/* Main Body */}

            {/* Edit Profile */}
            <Pressable onPress={gotoEditProfile}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, display: 'flex' }}>
                    <Image source={require('./user.png')} style={{ height: 30, width: 30 }} />
                    <Text style={{ color: '#CCCCCC', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>Edit Profile</Text>
                </View>
            </Pressable>

            {/* Change Password */}
            <Pressable onPress={gotoChangePassword}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, display: 'flex' }}>
                    <Image source={require('./lock.png')} style={{ height: 30, width: 30 }} />

                    <Text style={{ color: '#CCCCCC', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>Change Passwords</Text>
                </View>
            </Pressable>

            {/* About Us */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, display: 'flex' }}>
                <Image source={require('./briefcase.png')} style={{ height: 30, width: 30 }} />

                <Text style={{ color: '#CCCCCC', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>About us</Text>
            </View>

            {/* Support & Feedback */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, display: 'flex' }}>
                <Image source={require('./help-circle.png')} style={{ height: 30, width: 30 }} />

                <Text style={{ color: '#CCCCCC', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>Support & feedback</Text>
            </View>

            {/* Terms & Conditions */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, display: 'flex' }}>
                <Image source={require('./file-text.png')} style={{ height: 30, width: 30 }} />

                <Text style={{ color: '#CCCCCC', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>Terms & condition</Text>
            </View>

            {/* Privacy Policy */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, display: 'flex' }}>
                <Image source={require('./file-text.png')} style={{ height: 30, width: 30 }} />

                <Text style={{ color: '#CCCCCC', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>Privacy policy  </Text>
            </View>

            {/* LogOut */}
            <Pressable onPress={getLogout}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, display: 'flex' }}>
                    <Image source={require('./log-out.png')} style={{ height: 30, width: 30 }} />

                    <Text style={{ color: 'red', fontSize: 20, marginLeft: 40, fontFamily: 'sf-pro' }}>Logout</Text>
                </View>
            </Pressable>

            {/* Delete Account */}
            <View style={{ flexDirection: 'row', borderRadius: 8, width: 360,position:'absolute',bottom:60,marginLeft:14 }}>
                <TouchableOpacity style={styles.btn} onPress={deleteUser}>
                    <Text style={styles.btntxt}>Delete account</Text>
                </TouchableOpacity>
            </View>

            {/* Confirmation Modal */}
            <Modal visible={showModal} animationType="fade" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={closeModal}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </Pressable>
                            <Pressable style={styles.modalButton} onPress={confirmDelete}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Version */}
            <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }} >
                <Text style={{ color: '#999999', fontSize: 14, fontFamily: 'sf-pro' }}>Version 1.0</Text>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({ 

    laketxt: {
        fontSize: 20,
        fontFamily: 'audiowide_regular',
        fontWeight: 500,
        color: '#CCCCCC',
        textTransform: 'uppercase',
        textAlign: 'right',
        paddingLeft: 13,
    },
    btn: {
        elevation: 9,
        backgroundColor: 'transperant',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 15,
        borderColor: '#4DED75',
        borderWidth: 1,
        width: '100%',
        borderRadius: 4
    },
    btntxt: {
        color: '#4DED75',
        fontSize: 18,
        fontWeight: 500,
        alignSelf: 'center',
        fontFamily: 'audiowide_regular',
        textTransform: 'uppercase',

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: 0.8
    },
    modalContent: {
        backgroundColor: '#101010',
        padding: 20,
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'sf-pro'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#4DED75',
    },
    modalButtonText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'audiowide_regular'
    },

});

export default Profile;


