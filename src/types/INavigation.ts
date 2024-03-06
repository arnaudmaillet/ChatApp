import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IChat } from "./IChat";
import { NavigationProp, RouteProp } from "@react-navigation/native";

type TRouteStackParamList = {
    Login: undefined;
    Home: undefined;
    Chat: IChat;
};

type TNavigationProps<T extends keyof TRouteStackParamList> = {
    navigation: NativeStackNavigationProp<TRouteStackParamList, T>;
};

type TLoginNavigationProp = NavigationProp<TRouteStackParamList, 'Login'>;
type THomeNavigationProp = NavigationProp<TRouteStackParamList, 'Home'>;
type TChatNavigationProp = RouteProp<TRouteStackParamList, 'Chat'>;


export type { 
    TRouteStackParamList, 
    TNavigationProps,
    TLoginNavigationProp,
    THomeNavigationProp, 
    TChatNavigationProp 
};