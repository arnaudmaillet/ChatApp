import React from "react";
import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from "react-native";

import TextInputApp from "../components/TextInputApp/TextInputApp";
import TouchableOpacityApp from "../components/TouchableOpacityApp/TouchableOpacityApp";
import { IDataAuth, useSession } from "../contexts/Session";

const Login: React.FC = () => {
    const { signIn, signUp, isLoading } = useSession();
    const [dataAuth, setDataAuth] = React.useState<IDataAuth>({ email: '', password: '' });

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInputApp
                    style={styles.input}
                    placeholder="Email"
                    value={dataAuth.email}
                    autoCapitalize="none"
                    onChangeText={(text) => setDataAuth({ ...dataAuth, email: text })}
                ></TextInputApp>
                <TextInputApp
                    style={styles.input}
                    placeholder="Password"
                    value={dataAuth.password}
                    autoCapitalize="none"
                    onChangeText={(text) => setDataAuth({ ...dataAuth, password: text })}
                    secureTextEntry={true}
                ></TextInputApp>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <TouchableOpacityApp
                            text="Login"
                            onPress={() => signIn(dataAuth)}
                        />
                        <TouchableOpacityApp
                            text="Create account"
                            onPress={() => signUp(dataAuth)}
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