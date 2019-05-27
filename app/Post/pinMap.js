import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, Platform} from 'react-native';
import {Button} from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GeoAddressShort, GeoAddressFull } from '../helpers/GeoAddress';
import marker from '../assets/images/pin_location.png';

const latitudeDelta = 0.003
const longitudeDelta = 0.003

export default class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error:null,
      region: null,
      shortAddress: "",
      fullAddress: ""
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          error: null,
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }
        }, () => {
          fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+this.state.region.latitude+','+this.state.region.longitude+'&key=AIzaSyB1V50rJuipzBiuMi1BoPdjdx1xV33NmLA&language=TH')
            .then((response) => response.json())
            .then((responseJson) => {
              this.setState({
                shortAddress: GeoAddressShort(responseJson),
                fullAddress: GeoAddressFull(responseJson)
              })
            })
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }
  
  componentWillUnmount() {
    this.props.onPop({
      latitude:this.state.region.latitude,
      longitude:this.state.region.longitude,
      shortAddress:this.state.shortAddress,
      fullAddress:this.state.fullAddress
    });
  }

  onRegionChange = region => {
    this.setState({
      region,
      error: null
    }, () => {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+this.state.region.latitude+','+this.state.region.longitude+'&key=AIzaSyB1V50rJuipzBiuMi1BoPdjdx1xV33NmLA&language=TH')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            shortAddress: GeoAddressShort(responseJson),
            fullAddress: GeoAddressFull(responseJson)
          })
        })
    });
  }

  returnData = () => {
    Actions.pop();
  }

  render () {
    const region = this.state.region
    return (
      <SafeAreaView style={[ styles.container ]} forceInset={{ top:'always' }}>
        {(region)?
        <MapView 
          style={[styles.map]} 
          provider={PROVIDER_GOOGLE} 
          followsUserLocation={true} 
          showsUserLocation={true}
          region={!!region ? region:null}
          initialRegion={!!region ? region:null}
          onRegionChangeComplete={this.onRegionChange}
        >
        </MapView>:null
        }
        <View style={{left: '50%', marginLeft: -24, marginTop: (Platform.OS === 'ios')?0:-48, position: 'absolute', top: '50%'}}>
          <Image style={{height: 48,width: 48, tintColor: theme.COLOR_RED}} source={marker} />
        </View>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}} >
          <View style={{marginBottom:10, bottom:0, position:'absolute', width:"80%" }}>
            <Button mode="contained" color="#9BC73C" dark={true} onPress={this.returnData} style={{width:'100%'}}>
              <Text style={{fontSize: 18, textAlign:"center", fontFamily: theme.FONT_FAMILY, width:"100%" }}>ตกลง</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}