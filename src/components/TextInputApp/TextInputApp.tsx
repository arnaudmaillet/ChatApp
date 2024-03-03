import { TextInput } from 'react-native'
import React from 'react'

import ITextInputApp from './ITextInputApp'

const TextInputApp: React.FC<ITextInputApp> = (props) => {
    return (
        <TextInput
            {...props}
        ></TextInput>
    )
}

export default TextInputApp