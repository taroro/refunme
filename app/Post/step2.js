import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase'
import moment from 'moment'
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';
import PhotoSelect from './photoSelect';
import ItemList from './itemList';

export default class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      items: [],
      loading: false
    };
    console.warn(props);
  }

  _goToLastStep = e => {
    e.preventDefault();
    const db = firebase.firestore();
    const storage = firebase.storage();
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("post").add({
      refunme_id: "qxNhLWm7pdzKAKu83cfQ",
      post_type: this.props.postType,
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      available_datetime: this.props.dateTime,
      post_datetime: moment(new Date()).format('DD/MM/YYYY HH:mm'), 
      status: 0
    }).then((docRef) => {
      console.warn(this.state.items);
      this.state.items.map((item, key) => {
        docRef.collection("items").add({
          cate_id: item.itemData.mainCate,
          subcate_id: item.itemData.subCate,
          subcate_title: item.itemData.cateTitle,
          quantity: item.itemData.quantity,
          unit: item.itemData.unit
        })
      })
    });
  };

  _updatePhotoData = (photos) => {
    this.setState({
      photos: photos,
      loading: true
    }, () => { this._deLoading() })
  }

  _updateItemData = (items) => {
    this.setState({
      items: items,
      loading: true
    }, () => { this._deLoading() })
  }

  _deLoading = () => {
    this.setState({
      loading: false
    })
  }

  render() {
    return (
      <SafeAreaView style={[styles.container]} forceInset={{top:"always"}}>
        <NavBarRefun title="ประกาศขาย" action="home" />
        <View style={[styles.postContainer]}>
          <View style={[styles.postStep]}>
            <Image source={require("../assets/images/steps02.png")} />
          </View>
        </View>
        <View style={{flex:1}}>
          <ScrollView>
            <PhotoSelect _updatePhotoDataToParent={this._updatePhotoData.bind(this)} />
            <ItemList _updateItemDataToParent={this._updateItemData.bind(this)} />
          </ScrollView>
          <View style={{marginTop:10, marginLeft:15, marginRight:15, marginBottom:10}}>
            <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this._goToLastStep}>
              <Text style={{fontSize:18, textAlign:"center", fontFamily:theme.FONT_FAMILY, width: "80%"}}>ต่อไป</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}