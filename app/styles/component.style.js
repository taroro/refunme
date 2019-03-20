import { StyleSheet } from 'react-native';
import theme from '../styles/theme.style';

export default StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:theme.BACKGROUND_PRIMARY_COLOR,
    },
    scrollView: {
        flexGrow:1,
        flex:1,
        backgroundColor:theme.BACKGROUND_PRIMARY_COLOR,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        position:'absolute'
    },
    textNormal: {
        color:theme.FONT_PRIMARY_COLOR, 
        fontFamily:theme.FONT_FAMILY, 
        fontSize:theme.FONT_SIZE_LARGE, 
        textAlign:'left', 
    },
    textSmall: {
        color:theme.FONT_SECONDARY_COLOR, 
        fontFamily:theme.FONT_FAMILY, 
        fontSize:theme.FONT_SIZE_MEDIUM, 
        textAlign:'left', 
    },
    textTiny: {
        color:theme.FONT_SECONDARY_COLOR, 
        fontFamily:theme.FONT_FAMILY, 
        fontSize:theme.FONT_SIZE_SMALL, 
        textAlign:'left', 
    },
});