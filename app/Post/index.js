import React, {Component} from 'react';
import {Text, View, ScrollView, SafeAreaView, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';
import PostTypeSelect from './postTypeSelect';
import DateTimeSelect from './dateTimeSelect';
import LocationSelect from './locationSelect';

export default class Step1 extends Component {
  constructor() {
    super();
    this.state = {
      postType: 0,
      dateTime: "",
      location: {
        latitude: "0.00000",
        longitude: "0.00000"
      },
      loading: false
    };
  }

  _updatePostType = (postTypeData) => {
    this.setState({
      postType: postTypeData,
      loading: true
    }, () => { this._deLoading() })
  }

  _updateDateTime = (dateTimeData) => {
    this.setState({
      dateTime: dateTimeData,
      loading: true
    }, () => { this._deLoading() })
  }

  _updateLocation = (locationData) => {
    this.setState({
      location: locationData,
      loading: true
    }, () => { this._deLoading() })
  }

  _deLoading = () => {
    this.setState({
      loading: false
    })
  }

  _checkEmpty = () => {
    if(this.state.dateTime == "") return false;
    if(this.state.location.latitude == "0.00000" || this.state.location.longitude == "0.00000") return false;
    return true;
  }

  _goToSecondStep = () => { 
    const postTypePass = this.state.postType
    const dateTimeData = this.state.dateTime
    const locationData = this.state.location
    //if(!this._checkEmpty()) {
      Actions.secondstep({
        postType: postTypePass,
        dateTime: dateTimeData,
        location: locationData
      }) 
    //} 
  }

  render() {
    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <NavBarRefun title='ประกาศขาย' action='home' />
        <View style={{alignItems: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', width: '100%'}}>
          <View style={{ 
            alignItems: 'center', 
            backgroundColor: theme.BACKGROUND_SECONDARY_COLOR,
            paddingBottom: 5,  
            paddingTop: 5, 
            width:'100%'
          }}>
            <Image source={require('../assets/images/steps01.png')} />
          </View>
        </View>
        <View style={{flex: 1}} >
          <ScrollView>
            <View style={{alignItems: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', width: '100%'}}>
              <PostTypeSelect _updatePostTypeToParent={this._updatePostType.bind(this)} />
              <DateTimeSelect _updateDateTimeToParent={this._updateDateTime.bind(this)} />
              <LocationSelect _updateLocationToParent={this._updateLocation.bind(this)} />
            </View>
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <Button mode="contained" color="#9BC73C" dark={true} onPress={this._goToSecondStep}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%" }}>ต่อไป</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}