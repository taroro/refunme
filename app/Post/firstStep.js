import React, {Component} from 'react';
import { 
    Text, 
    View, 
    Image, 
    ImageBackground, 
    TouchableOpacity,
} from 'react-native';
import { 
    Button, 
    RadioButton, 
    Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Actions } from 'react-native-router-flux';
import { TextInput } from 'react-native-paper'
// Custom Components
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import TextBoxDisabled from '../components/TextBoxDisabled';

export default class FirstStep extends Component {
    constructor() {
        super();
        this.state = {
            checked:'fast', 
        };
    }

    render() {

        return (
        );
    }
}