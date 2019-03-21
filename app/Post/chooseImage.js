import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
// Custom Components
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';

export default class ChooseImage extends Component {
    constructor() {
      super();
      this.state = {
        photo: null,
        valueArray: [], 
        disabled: false
      };
      this.index = 0;
    }

    _handleChoosePhoto = () => {
        const options = {
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.uri) {
                let newlyAddedValue = { uri: response.uri }
                this.setState({
                    valueArray: [ ...this.state.valueArray, newlyAddedValue ]
                });
                this.index = this.index + 1
            }
        });
    };
    _goToLastStep = () => {

    }

    render() {
        let newArray = this.state.valueArray.map((item, key) => {
            return(
                <Image key={key} style={{borderRadius:10, width:75, height:75, marginRight:5, marginBottom:5}} source={{ uri: item.uri }} />
            );
        });

        return (
            <SafeAreaView style={[styles.container]} forceInset={{top:'always'}}>
                <NavBarRefun title='ประกาศขาย' action='home' />
                <View style={{alignItems:'stretch', flexDirection:'column', justifyContent:'flex-start', width:'100%',}}>
                    <View style={{ 
                        alignItems:'center', 
                        backgroundColor:theme.BACKGROUND_SECONDARY_COLOR,
                        paddingBottom:5,  
                        paddingTop:5, 
                        width:'100%',}}>
                        <Image source={require('../assets/images/steps02.png')} />
                    </View>
                </View>
                <View style={{flex:1}}>
                    <ScrollView>
                        <View style={{ 
                            alignItems:'stretch', 
                            flex:1, 
                            flexDirection:'column', 
                            justifyContent:'flex-start', 
                            width:'100%',}}>
                            <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                                <View><Text style={[styles.textNormal, {paddingLeft:10}]}>อัพโหลดรูปภาพ</Text></View>
                            </View>
                            <View style={{
                                width:'100%', flexDirection:'row', marginTop:10, marginLeft:15, marginRight:15,
                                flexWrap: 'wrap', alignItems:'stretch',
                                }}>
                                {newArray}
                                <TouchableOpacity onPress={this._handleChoosePhoto} >
                                    <View style={{
                                        backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                                        borderRadius:10, width:75, height:75, marginRight:5, marginBottom:5,
                                        justifyContent:'center', alignItems:'center'}}>
                                        <Icon
                                            name="plus"
                                            size={35}
                                            backgroundColor={theme.COLOR_WHITE}
                                            color={theme.PRIMARY_COLOR}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ 
                            alignItems:'stretch', 
                            flex:1, 
                            flexDirection:'column', 
                            justifyContent:'flex-start', 
                            width:'100%',}}>
                            <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                                <View><Text style={[styles.textNormal, {paddingLeft:10}]}>รายการของที่ต้องการขาย</Text></View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{marginTop:10, marginLeft: 15, marginRight: 15, marginBottom:10}}>
                        <Button mode="contained" color="#9BC73C" dark={true} onPress={this._goToLastStep}>
                        <Text style={{fontSize: 18, textAlign:"center", fontFamily: theme.FONT_FAMILY, width:"80%" }}>ต่อไป</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}