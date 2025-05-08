import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const AuthScreen = () => {
    const handleLogin = () => {
        // Handle login logic here
        console.log('Login pressed');
    };

    const handleSignup = () => {
        // Handle signup logic here
        console.log('Signup pressed');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Auth Screen</Text>
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry />
            <View style={styles.buttonContainer}>
                <Button title="Login" onPress={handleLogin} />
                <Button title="Signup" onPress={handleSignup} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

export default AuthScreen;