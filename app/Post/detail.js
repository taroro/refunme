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
import ItemList from './itemList';
import { DateFormat } from '../helpers/DateFormat';

export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.unsubscribePost = null;
    this.unsubscribePhotos = null;
    this.unsubscribeItems = null;
    this.refPostDocument = firebase.firestore().collection('post').doc(this.props.postKey);
    this.refPhotos = firebase.firestore().collection('post').doc(this.props.postKey).collection('photos');
    this.refItems = firebase.firestore().collection('post').doc(this.props.postKey).collection('items');

    this.state = {
      postKey: this.props.postKey,
      postDetail: null,
      postItems: [],
      postPhotos: [],
      loading: true,
      showDetail: false,
      items: [],
    };
  }

  componentDidMount() {
    this.unsubscribePost = this.refPostDocument.onSnapshot(this._onDocumentUpdate);
    this.unsubscribePhotos = this.refPhotos.onSnapshot(this._onPhotosUpdate);
    this.unsubscribeItems = this.refItems.onSnapshot(this._onItemsUpdate);
  }

  componentWillUnmount() {
    this.unsubscribePost();
    this.unsubscribePhotos();
    this.unsubscribeItems();
  }

  _onDocumentUpdate = (postSnapshot) => {
    this.setState({
      postDetail: {
        key: postSnapshot.id,
        availableDateTime: postSnapshot.data().available_datetime,
        latitude: postSnapshot.data().latitude,
        longitude: postSnapshot.data().longitude,
        postDateTime: postSnapshot.data().post_datetime,
        postType: postSnapshot.data().post_type,
        refunMeId: postSnapshot.data().refunme_id,
        shortAddress: postSnapshot.data().short_address,
        fullAddress: postSnapshot.data().full_address,
      },
      loading: false,
    })
  }

  _onItemsUpdate = (itemsSnapshot) => {
    const items = [];
    itemsSnapshot.forEach((item) => {
      items.push({
        key: item.id,
        categoryId: item.data().cate_id,
        quantity: item.data().quantity,
        subCategoryId: item.data().subcate_id,
        subCategoryTitle: item.data().subcate_title,
        unit: item.data().unit
      });
    })
    this.setState({ postItems: items })
  }

  _onPhotosUpdate = (photosSnapshot) => {
    const photos = [];
    photosSnapshot.forEach((photo) => {
      photos.push({
        key: photo.id,
        title: photo.data().title,
        url: photo.data().url,
      });
    })
    this.setState({ postPhotos: photos })
  }

  _renderEmpty() {
    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: "always"}}>
        <NavBarRefun title="REFUN ME" action="home" />
        <View style={{flex: 1}}>
          <ScrollView>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }

  render() {
    let photoDisplayArray = (this.state.postPhotos.length > 0)?this.state.postPhotos.map((photo, key) => {
      return (
        <Image key={"photo"+photo.key} style={[styles.thumbnailPhoto]} source={{uri:photo.url}} />
      );
    }):null;

    let itemDisplayArray = (this.state.postItems.length > 0)?this.state.postItems.map((item, key) => {
      return (
        <View key={"item"+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{key+1}</Text>
              </View>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.subCategoryTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"center", alignItems: "center"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.quantity} {item.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    }):null;

    let postDetail = this.state.postDetail;
    let date = (postDetail == null)?"":DateFormat(postDetail.availableDateTime);
    let postDate = (postDetail == null)?"":DateFormat(postDetail.postDateTime);

    return (postDetail == null)?this._renderEmpty():(
      <SafeAreaView style={[styles.container]} forceInset={{top: "always"}}>
        <NavBarRefun title="ประกาศขาย" action="home" />
        <View style={{flex: 1}}>
          <ScrollView>
            <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
              <View><Text style={[styles.textNormal, {paddingLeft:10}]}>ยืนยันการประกาศขาย</Text></View>
              <View style={{ backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, borderRadius:10, width: '100%'}}>
                <View style={{width: "100%",height: 80}}>
                  <View style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft:5, marginRight:5, flexDirection:'row'}}>
                    <View>
                      <Icon name="calendar" size={35} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                    </View>
                    <View style={{marginLeft:20}}>
                      <Text style={[styles.textExtraLarge]}>{date.today?"วันนี้":"วัน"+date.dayFullText+"ที่ "+date.dateNum+" "+date.monthFullText+" "+date.year} {date.timeText+" น."}</Text>
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
        </View>
      </SafeAreaView>

    )
  }
}