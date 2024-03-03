import { View, ActivityIndicator } from 'react-native'
import React from 'react'

const AppLoading = () => {
    return (
        <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size="large" color="#43C651" />
        </View>
    )
}

export default AppLoading