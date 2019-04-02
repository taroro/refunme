import React, {Component} from 'react';
import {Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Actions} from 'react-native-router-flux';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import TextBoxDisabled from '../components/TextBoxDisabled';

export default class LocationSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude:'0.00000',
      longitude:'0.00000',
    };
  }

  _goToPinMap = () => { Actions.pinmap({onPop:this._backFromPinMap.bind(this)}) }
  _backFromPinMap(location){
    this.setState({
      latitude:location.latitude,
      longitude:location.longitude,
    }, () => { this.props._updateLocationToParent({
      latitude:this.state.latitude,
      longitude:this.state.longitude,
    })} );
    
  }

  render() {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;

    return (
      <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
        <View><Text style={[styles.textNormal, {paddingLeft:10}]}>ระบุพิกัดตำแหน่งบ้าน</Text></View>
        <View style={{backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, borderRadius:10, width:'100%',}}>
          <View style={{height:55, flexDirection:'row'}} >
            <View style={{width:70, justifyContent:'center', alignItems:'center'}}>
              <Icon name="location-pin" size={35} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            </View>
            <View style={{justifyContent:'center', flex:1, paddingRight:10}}>
              <TouchableOpacity onPress={this._goToPinMap} >
                <TextBoxDisabled title={latitude+', '+longitude} />
              </TouchableOpacity>
            </View>
            </View>
        </View>
        <View style={{width:"100%", height:150}}>
          <TouchableOpacity onPress={this._goToPinMap} >
            <ImageBackground 
              source={require('../assets/images/mapmockup.png')} 
              style={{width:'100%', height:150, justifyContent:'center', alignItems:'center'}} >
              <Button 
                mode="contained" 
                color={theme.SECONDARY_COLOR} 
                dark={true} 
                style={{width:"60%"}}>
                <Text style={[styles.textNormal]}>คลิกเพื่อระบุพิกัด</Text>
              </Button>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}