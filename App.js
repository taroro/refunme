/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import firebase from 'react-native-firebase';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { MKButton } from 'react-native-material-kit';
import { Appbar } from 'react-native-paper';

const ref = firebase.firestore().collection('refunme').doc('qxNhLWm7pdzKAKu83cfQ');


type Props = {};
class App extends Component<Props> {
  constructor() {
    super();
    this.state = {};
  }
  async componentDidMount() {
  }
  
  render() {
    return (
      <View style={styles.container}>
      <Text style={{ color:"#9BC73C", fontSize: 18, textAlign:"center", 
      ...Platform.select({
        ios: {
          fontFamily: "Sukhumvit Set",
        },
        android: {
          fontFamily: "sukhumvitset_text",
        },
      }),
      
        }}>เปิดประกาศขายเลือก REFUN MAN รับซื้อ</Text>
            
      <Appbar style={styles.bottom}>
      <Appbar.Action icon="archive" onPress={() => console.log('Pressed archive')} />
      <Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')} />
      <Appbar.Action icon="label" onPress={() => console.log('Pressed label')} />
      <Appbar.Action icon="delete" onPress={() => console.log('Pressed delete')} />
    </Appbar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});


const AppNavigator = createStackNavigator({
  Home: {
    screen: App
  }
});
export default createAppContainer(AppNavigator);
//export default App;