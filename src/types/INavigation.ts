import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IChat } from "./IChat";
import { NavigationProp, RouteProp } from "@react-navigation/native";

type TRouteStackParamList = {
    TabBar: undefined;
    Login: undefined;
    Cam: undefined;
    Chats: undefined;
    Chat: IChat;
    Archive: undefined;
    Profile: undefined;
};

type TNavigationProps<T extends keyof TRouteStackParamList> = {
    navigation: NativeStackNavigationProp<TRouteStackParamList, T>;
};

type TTabBarNavigationProp = NavigationProp<TRouteStackParamList, 'TabBar'>;
type TCamNavigationProp = NavigationProp<TRouteStackParamList, 'Cam'>;
type TLoginNavigationProp = NavigationProp<TRouteStackParamList, 'Login'>;
type TChatsNavigationProp = NavigationProp<TRouteStackParamList, 'Chats'>;
type TChatNavigationProp = RouteProp<TRouteStackParamList, 'Chat'>;
type TArchiveNavigationProp = NavigationProp<TRouteStackParamList, 'Archive'>;
type TProfileNavigationProp = NavigationProp<TRouteStackParamList, 'Profile'>;



export type { 
    TRouteStackParamList, 
    TNavigationProps,
    TTabBarNavigationProp,
    TLoginNavigationProp,
    TChatsNavigationProp, 
    TChatNavigationProp,
    TCamNavigationProp,
    TArchiveNavigationProp,
    TProfileNavigationProp
};