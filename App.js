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

const ref = firebase.firestore().collection('refunme').doc('qxNhLWm7pdzKAKu83cfQ');

type Props = {};
class App extends Component<Props> {
  constructor() {
    super();
    this.state = {};
  }


  async componentDidMount() {

    firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(ref);
  
      // if it does not exist set the population to one
      if (!doc.exists) {
        transaction.set(ref, { status: 1 });
        // return the new value so we know what the new population is
        return 1;
      }
  
      // exists already so lets increment it + 1
      const newPopulation = doc.data().status + 1;
  
      transaction.update(ref, {
        status: newPopulation,
      });
  
      // return the new value so we know what the new population is
      return newPopulation;
    }).then(newPopulation => {
      console.log(
        `Transaction successfully committed and new population is '${newPopulation}'.`
      );
    })
    .catch(error => {
      console.log('Transaction failed: ', error);
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          style={styles.map}
        />
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

export default App;