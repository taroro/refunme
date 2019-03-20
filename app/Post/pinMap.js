import React, { Component } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  ImageBackground, 
  Dimensions,
  TouchableOpacity,
} from 'react-native';

//import firebase from 'react-native-firebase';
import { 
  Button, 
  RadioButton, 
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Actions } from 'react-native-router-flux';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';
import TextBoxDisabled from '../components/TextBoxDisabled';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error:null,
      region: null,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          },
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }
  
  componentWillUnmount() {
    this.props.onPop({
      latitude:this.state.latitude,
      longitude:this.state.longitude
    });
  }

  returnData = () => {
    Actions.pop();
  }

  render () {
    return (
      <SafeAreaView style={[ styles.container ]} forceInset={{ top:'always' }}>
        <MapView style={[styles.map]} provider={PROVIDER_GOOGLE} followsUserLocation={true} showsUserLocation={true}
        region={!!this.state.region ? this.state.region:null}
        >
          {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
          coordinate={{"latitude":this.state.latitude, "longitude":this.state.longitude}}
          title={"ตำแหน่งของคุณ"}
          />}
        </MapView>
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