import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import firebase from 'react-native-firebase'
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import {DateFormat} from '../helpers/DateFormat'
import {Appbar} from 'react-native-paper'
import WaitingQuotation from '../Home/waitingQuotation'
import AcceptedQuotation from '../Home/acceptedQuotation'
import moment from 'moment';

export default class PostDetail extends Component {
  constructor(props) {
    super(props)
    this.unsubscribePost = null
    this.refPostDocument = firebase.firestore().collection('post').doc(this.props.postId)
    
    this.state = {
      postId: this.props.postId,
      postDetail: null,
      postItems: [],
      postPhotos: [],
      loading: true,
      showDetail: false,
      message: '',
      chatSender: '',
      refunManId: '',
    }
  }

  componentDidMount() {
    this.unsubscribePost = this.refPostDocument.onSnapshot(this._onPostUpdate)
  }

  componentWillUnmount() {
    this.unsubscribePost()
  }

  _onPostUpdate = (postSnapshot) => {
    var postData = postSnapshot.data();

    var promiseItems = new Promise((resolve, reject) => {
      this.refPostDocument.collection('items').get().then((itemCollection) => {
        var items = [];
        itemCollection.forEach((item) => {
          var data = item.data();
          items.push({
            id: item.id,
            quantity: data.quantity,
            subCategoryTitle: data.subcate_title,
            unit: data.unit
          });
        });
        resolve(items);
      });
    });

    var promisePhotos = new Promise((resolve, reject) => {
      this.refPostDocument.collection('photos').get().then((photoCollection) => {
        var photos = [];
        photoCollection.forEach((photo) => {
          var data = photo.data()
          photos.push({
            id: photo.id,
            title: data.title,
            url: data.url,
          })
        });
        resolve(photos);
      });
    });

    var promiseQuotation = new Promise((resolve, reject) => {
      if(postData.accepted_quotation != '') {

        firebase.firestore().collection('quotation').doc(postData.accepted_quotation).get().then((quotation) => {
          this.setState({
            chatSender: quotation.data().refunme_id,
            refunManId: quotation.data().refunman_id,
          })
        })
      }
      resolve('ok');
    });

    Promise.all([promiseItems, promisePhotos, promiseQuotation]).then(([items, photos, quotation]) => {
      this.setState({
        postDetail: {
          id: postSnapshot.id,
          availableDateTime: postData.available_datetime,
          latitude: postData.latitude,
          longitude: postData.longitude,
          postDateTime: postData.post_datetime,
          postType: postData.post_type,
          refunMeId: postData.refunme_id,
          shortAddress: postData.short_address,
          fullAddress: postData.full_address,
          acceptedQuotation: postData.accepted_quotation,
          status: postData.status,
        },
        postItems: items,
        postPhotos: photos,
        loading: false,
        message: '',
      })
    })
  }

  _toggleDetail = () => {
    this.setState({
      showDetail: !this.state.showDetail
    })
  }

  _onPressMenuButton() {
    Actions.pop();
  }

  _sendMessage() {
    firebase.firestore().collection('quotation').doc(this.state.postDetail.acceptedQuotation).collection('chat').add({
      message: this.state.message,
      send_datetime: moment(new Date()).format('DD/MM/YYYY HH:mm'),
      sender: this.state.chatSender,
      receiver: this.state.refunManId,
    }).then((doc) => {
      this.setState({
        message: ''
      })
    })
  }

  _sendLocation() {

  }

  render() {
    let photoDisplayArray = (this.state.postPhotos.length > 0)?this.state.postPhotos.map((photo, key) => {
      return (
        <Image key={'photo'+key} style={[styles.thumbnailPhoto]} source={{uri:photo.url}} />
      );
    }):null;

    let itemDisplayArray = (this.state.postItems.length > 0)?this.state.postItems.map((item, key) => {
      return (
        <View key={'item'+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:3, justifyContent:'flex-start', alignItems: 'flex-start', flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{key+1}</Text>
              </View>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.subCategoryTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:'center', alignItems: 'center'}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.quantity} {item.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    }):null;

    let postDetail = this.state.postDetail;
    let date = (postDetail == null)?'':DateFormat(postDetail.availableDateTime);
    let status = (postDetail == null)?0:this.state.postDetail.status;

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign: 'center', backgroundColor: theme.PRIMARY_COLOR, marginBottom: 0}}>
            <Appbar.Action icon='arrow-back' color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title='REFUN ME'
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View>
        <View style={{flex: 1}}>
          <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight)=>{        
                this.scrollView.scrollToEnd({animated: true});
            }}>
            {(postDetail)?
            <View style={{marginTop: 20, marginLeft: 15, marginRight: 15}}>
              <View style={{backgroundColor: theme.BACKGROUND_SECONDARY_COLOR, borderRadius: 10, width: '100%'}}>
                <View style={{width: '100%',height: 30, marginBottom: 10}}><Text style={[styles.textSmall, {textAlign: 'center', marginTop: 10}]}>ขณะนี้ประกาศของคุณกำลังทำงาน</Text></View>
                <View style={{flex: 2, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                      <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: theme.PRIMARY_COLOR, padding: 5, width: '100%', borderRadius: 20, marginLeft: 30}}>
                        <Text style={[styles.textHeader, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>{date.dayFullText}</Text>
                        <Text style={[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginTop: -15, marginBottom: -10}]}>{date.dateNum}</Text>
                      </View>
                    </View>
                    <View style={{flex: 5, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 30, paddingTop: 5}}>
                      <Text style={[styles.textHeader, {color: theme.COLOR_DARKGREY, textAlign: 'left'}]}>{date.monthFullText+' '+date.year}</Text>
                      <Text style={[styles.textExtraLarge, {color: theme.PRIMARY_COLOR, textAlign: 'left'}]}>เวลา {date.timeText}</Text>
                    </View>
                  </View>
                </View>
                {(this.state.showDetail)?
                <View>
                  <View style={[styles.confirmPhotoContainer]}>{photoDisplayArray}</View>
                  <View><Text style={[styles.textHeader, {paddingLeft: 15, paddingTop: 10, color: theme.PRIMARY_COLOR}]}>รายการสิ่งของ</Text></View>
                  <Divider />
                  <View>{itemDisplayArray}</View>
                </View>:null
                }
                <Divider/>
                <TouchableOpacity onPress={() => this._toggleDetail()}>
                  {(this.state.showDetail)?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
                      <Icon name='arrow-upward' size={25} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Text style={[styles.textNormalGreen, {marginLeft: 10}]}>ซ่อนรายละเอียด</Text>
                    </View>
                    :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
                      <Icon name='arrow-downward' size={25} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Text style={[styles.textNormalGreen, {marginLeft: 10}]}>แสดงรายละเอียด</Text>
                    </View>
                  }
                </TouchableOpacity>
              </View>
              {(this.state.postDetail.acceptedQuotation == "")?
              <WaitingQuotation postId={this.state.postId} />:<AcceptedQuotation quotationId={this.state.postDetail.acceptedQuotation} />
              }
            </View>:null
            }
          </ScrollView>
          {(status == 2)?
            <View style={{padding: 10, backgroundColor: theme.BACKGROUND_SECONDARY_COLOR, flexDirection: 'row', height: 60}}>
              <View style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this._sendLocation}>
                  <Icon name='add-location' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInput
                  style={{height:40, borderRadius:10, width: '100%', backgroundColor: theme.COLOR_WHITE, paddingLeft:10, paddingRight:10,}}
                  onChangeText={(message) => this.setState({message})}
                  value={this.state.message}
                  autoFocus
                />
              </View>
              <View style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this._sendMessage()}>
                  <Icon name='send' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                </TouchableOpacity>
              </View>
            </View>:null
          }
        </View>
      </SafeAreaView>
    )
  }
}