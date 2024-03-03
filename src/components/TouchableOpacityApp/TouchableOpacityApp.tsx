import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ITouchableOpacityApp from './ITouchableOpacityApp'

const TouchableOpacityApp: React.FC<ITouchableOpacityApp> = ({ text, width, ...props }: ITouchableOpacityApp) => {
    return (
        <View className={`${width ? width : 'w-full'} items-center justify-center p-2 m-auto`}>
            <TouchableOpacity
                className={`w-full px-4 py-2 bg-green-500 rounded-xl items-center justify-center`}
                {...props}
            >
                <Text className={`py-2 text-white text-xl font-semibold`}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default TouchableOpacityApp