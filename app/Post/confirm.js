import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import moment from 'moment';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';
import PhotoSelect from './photoSelect';
import ItemList from './itemList';
import { DateFormat } from '../helpers/DateFormat';

export default class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  
  _uploadImage(docRef, index, uri, mime = 'image/jpg') {
    return new Promise((resolve, reject) => {
      const imageRef = firebase.storage().ref('photos/'+docRef.id+'/').child('image'+index.toString()+'.jpg')
      imageRef.put(uri, {contentType: mime})
      .then(() => { return imageRef.getDownloadURL(); })
      .then((url) => {
        resolve(url);
        docRef.collection('photos').add({
          title: 'thumb_image'+index.toString()+'.jpg',
          url: url.replace('image', 'thumb_image')
        });
      })
      .catch((error) => { reject(error); });
    })
  }

  _finishPost = e => {
    e.preventDefault();
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("post").add({
      refunme_id: "qxNhLWm7pdzKAKu83cfQ",
      //refunme_id: "L4QaaX4V2Hgi6VdTrTkA",
      post_type: this.props.postData.postType,
      latitude: this.props.postData.latitude,
      longitude: this.props.postData.longitude,
      short_address: this.props.postData.shortAddress,
      full_address: this.props.postData.fullAddress,
      available_datetime: this.props.postData.availableDatetime,
      post_datetime: moment(new Date()).format('DD/MM/YYYY HH:mm'), 
      status: 0, 
      accepted_quotation: "",
    }).then((docRef) => {
      this.props.itemArray.map((item, key) => {
        docRef.collection("items").add({
          cate_id: item.itemData.mainCate,
          subcate_id: item.itemData.subCate,
          subcate_title: item.itemData.cateTitle,
          quantity: item.itemData.quantity,
          unit: item.itemData.unit
        })
      })
      this.props.photoArray.map((item, key) => {
        this._uploadImage(docRef, key, item.uri.toString())
      })
      this.setState({
        docRef: docRef
      })
    }).then(() => {
      Actions.confirmeddetail({
        postKey: this.state.docRef.id,
        photoArray: this.props.photoArray
      })
    });
  }

  render() {
    let photoDisplayArray = this.props.photoArray.map((item, key) => {
      return (
        <Image key={"photo"+key} style={[styles.thumbnailPhoto]} source={{uri:item.uri}} />
      );
    });

    let itemDisplayArray = this.props.itemArray.map((item, key) => {
      return (
        <View key={"item"+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{key+1}</Text>
              </View>
              <View style={{marginLeft:5}}>
                <Icon name={item.itemData.icon} size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.itemData.cateTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"center", alignItems: "center"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.itemData.quantity} {item.itemData.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    });
    let date = DateFormat(this.props.postData.availableDatetime,);

    return(
      <SafeAreaView style={[styles.container]} forceInset={{top: "always"}}>
        <NavBarRefun title="ประกาศขาย" action="home" />
        <View style={[styles.postContainer]}>
          <View style={[styles.postStep]}>
            <Image source={require("../assets/images/steps03.png")} />
          </View>
        </View>
        <View style={{flex: 1}}>
          <ScrollView>
            <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
              <View><Text style={[styles.textNormal, {paddingLeft:10}]}>ยืนยันการประกาศขาย</Text></View>
              <View style={{ backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, borderRadius:10, width: '100%'}}>
                <View style={{width: "100%",height: 100}}>
                  <View style={{flex:1, justifyContent:"flex-start", alignItems:"flex-start", marginLeft:5, marginRight:5, flexDirection:'row', marginTop:10}}>
                    <View style={{width: 50, alignItems: "center", justifyContent:"center"}}>
                      <Icon name="calendar" size={35} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                    </View>
                    <View style={{marginLeft:10}}>
                      <Text numberOfLines={3} style={[styles.textHeader, {textAlign: "left"}]}>{date.today?"วันนี้":"วัน"+date.dayFullText+"ที่ "+date.dateNum+" "+date.monthShortText+" "+date.year+"\n"}{"เวลา "+date.timeText+" น."}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.confirmPhotoContainer]}>
                  {photoDisplayArray}
                </View>
                <View><Text style={[styles.textNormal, {paddingLeft:10}]}>รายการสิ่งของ</Text></View>
                <Divider />
                <View>{itemDisplayArray}</View>
              </View>
            </View>
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this._finishPost}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%"}}>ยืนยัน</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>

    )
  }
}