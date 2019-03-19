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
    const ColoredRaisedButton = MKButton.coloredButton()
    .withText('BUTTON')
    .withOnPress(() => {
      console.log("Hi, it's a colored button!");
    })
    .build();
    return (
      <View style={styles.container}>
        <ColoredRaisedButton />
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
});


const AppNavigator = createStackNavigator({
  Home: {
    screen: App
  }
});
export default createAppContainer(AppNavigator);
//export default App;