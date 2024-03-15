import React from "react";
import { View, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity, Text, Platform } from "react-native";

import TextInputApp from "../components/TextInputApp/TextInputApp";
import { IDataAuth, useSession } from "../contexts/Session";
import { AntDesign } from '@expo/vector-icons';

const Login: React.FC = () => {
    const { signIn, signUp, isLoading } = useSession();
    const [dataAuth, setDataAuth] = React.useState<IDataAuth>({ email: '', password: '' });

    return (
        <KeyboardAvoidingView
            className="flex-1"
            enabled={true}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <View className="flex-1"></View>
            <View className="flex-1 bg-white px-10 pb-10 justify-center">
                <View>
                    <View className="flex-row justify-center p-10">
                        <Text className="text-3xl font-bold text-center">Login</Text>
                    </View>
                    <TextInputApp
                        className="border border-gray-300 rounded-lg p-4 my-4"
                        placeholder="Email"
                        value={dataAuth.email}
                        autoCapitalize="none"
                        onChangeText={(text) => setDataAuth({ ...dataAuth, email: text })}
                    ></TextInputApp>
                    <TextInputApp
                        className="border border-gray-300 rounded-lg p-4 my-4"
                        placeholder="Password"
                        value={dataAuth.password}
                        autoCapitalize="none"
                        onChangeText={(text) => setDataAuth({ ...dataAuth, password: text })}
                        secureTextEntry={true}
                    ></TextInputApp>
                    <View className="flex-row justify-center mt-5">
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity
                                    className="border border-gray-300 rounded-full p-2 my-2 bg-black"
                                    onPress={() => signIn(dataAuth)}>
                                    <AntDesign name="login" size={34} color="white" />
                                </TouchableOpacity>
                                {/* <TouchableOpacityApp
                                    text="Create account"
                                    onPress={() => signUp(dataAuth)}
                                /> */}
                            </>
                        )}

                    </View>
                </View>
            </View >
        </KeyboardAvoidingView >
    )
}

export default Login