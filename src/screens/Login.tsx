import React, { useState } from "react";
import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from "react-native";

import { FIREBASE_AUTH } from "../../config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert("Sign up successful");
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed : " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput 
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                ></TextInput>
                <TextInput 
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                ></TextInput>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Button
                            title="Login"
                            onPress={signIn}
                        />
                        <Button
                            title="Create account"
                            onPress={signUp}
                        />
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    )
}

export default Login


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20
    },
    input: {
        height: 50,
        marginVertical: 4,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: "#fff"
    }
});