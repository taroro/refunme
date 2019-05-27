import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
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
      shortAddress: "",
      fullAddress: "คลิกเพื่อระบุพิกัด"
    };
  }

  _goToPinMap = () => { Actions.pinmap({onPop:this._backFromPinMap.bind(this)}) }
  _backFromPinMap(location){
    this.setState({
      latitude:location.latitude,
      longitude:location.longitude,
      shortAddress: location.shortAddress,
      fullAddress: location.fullAddress
    }, () => { this.props._updateLocationToParent({
      latitude:this.state.latitude,
      longitude:this.state.longitude,
      shortAddress: this.state.shortAddress,
      fullAddress: this.state.fullAddress
    })} );
    
  }

  render() {
    const fullAddress = this.state.fullAddress;

    return (
      <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
        <View><Text style={[styles.textNormal, {paddingLeft:10}]}>ระบุพิกัดตำแหน่งบ้าน</Text></View>
        <View style={{backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, borderRadius:10, width:'100%',}}>
          <View style={{height:55, flexDirection:'row'}} >
            <View style={{width:70, justifyContent:'center', alignItems:'center'}}>
              <Icon name="location-pin" size={32} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            </View>
            <View style={{justifyContent:'center', flex:1, paddingRight:10}}>
              <TouchableOpacity onPress={this._goToPinMap} >
                <TextBoxDisabled title={fullAddress} />
              </TouchableOpacity>
            </View>
            </View>
        </View>
      </View>
    )
  }
}