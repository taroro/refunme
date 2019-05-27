import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import {Appbar} from 'react-native-paper'

export default class QuotationDetail extends Component {
  constructor(props) {
    super(props);
    this.unsubscribePost = null;
    this.unsubscribePhotos = null;
    this.unsubscribeItems = null;
    this.refQuotations = firebase.firestore().collection('quotation').doc(this.props.quotationId);
    this.refItems =firebase.firestore().collection('quotation').doc(this.props.quotationId).collection('items');

    this.state = {
      quotationId: this.props.quotationId,
      quotationDetail: null,
      quotationItems: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribeQuotation = this.refQuotations.onSnapshot(this._onDocumentUpdate);
    this.unsubscribeItems = this.refItems.onSnapshot(this._onItemsUpdate);
  }

  componentWillUnmount() {
    this.unsubscribeQuotation();
    this.unsubscribeItems();
  }

  _onDocumentUpdate = (quotationSnapshot) => {
    this.setState({
      quotationDetail: {
        key: quotationSnapshot.id,
        post: quotationSnapshot.data().post_id,
        refunman: quotationSnapshot.data().refunman_id,
        refunme: quotationSnapshot.data().refunme_id,
        sentDate: quotationSnapshot.data().sent_datetime,
        status: quotationSnapshot.data().status,
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
        pricePerUnit: item.data().price_per_unit,
        subCategoryId: item.data().subcate_id,
        subCategoryTitle: item.data().subcate_title,
        unit: item.data().unit
      });
    })
    this.setState({ quotationItems: items })
  }

  _acceptQuotation = () => {
    firebase.firestore().collection('quotation')
      .where("post_id", "==", this.state.quotationDetail.post)
      .get().then((quotations) => {
        quotations.forEach((quotation) => {
          if(quotation.id != this.state.quotationId) {
            firebase.firestore().collection('quotation').doc(quotation.id).update({
              status: 4
            })
          } else {
            firebase.firestore().collection('quotation').doc(quotation.id).update({
              status: 1
            })
          }
        })
      }).then((doc) => {
        firebase.firestore().collection('post').doc(this.state.quotationDetail.post).update({
          status: 1,
          accepted_quotation: this.state.quotationId,
        }).then((doc) => {
          Actions.pop()
        })
      })
  }

  _rejectQuatation = () => {
    this.refQuotations.update({
      status: 4
    }).then((doc) => {
      Actions.pop()
    })
  }

  _onPressMenuButton() {
    Actions.pop();
  }

  render() {
    let itemDisplayArray = this.state.quotationItems.map((item, key) => {
      return (
        <View key={"item"+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10, paddingRight:10}]}>{key+1}</Text>
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.subCategoryTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"center", alignItems: "flex-end"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.pricePerUnit}</Text>
            </View>
            <View style={{flex:3, justifyContent:"center", alignItems: "center"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>บาท/{item.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    });

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: "always"}}>
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
          <ScrollView>
            <View style={{alignItems:"stretch", flex:1, flexDirection:"column", justifyContent:"flex-start", width:"100%"}}>
              <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                <View style={{flexDirection:"row"}}>
                  <View style={{width:100, height: 100, justifyContent:"center", alignItems:"center"}}>
                    <Icon name="face" size={80} backgroundColor={theme.COLOR_WHITE} color={theme.COLOR_DARKGREY} />
                  </View>
                  <View style={{flexDirection:"column"}}>
                    <Text style={[styles.textExtraLarge, {paddingLeft:10}]}>ใบเสนอราคา</Text>
                    <Text style={[styles.textNormal, {paddingLeft:10}]}>REFUN MAN #{this.props.number}</Text>
                    <View style={{flex:1, flexDirection:"row", marginTop:5, marginBottom:5, justifyContent:"center", alignItems:"center"}}>
                      <Icon name="star" size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Icon name="star" size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Icon name="star" size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Icon name="star-half" size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Icon name="star-border" size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flex:1, marginTop:10, marginLeft:15, marginRight:15}}>
                <View style={{flex:1, backgroundColor:theme.COLOR_LIGHTGREY, borderRadius:10}}>
                  <View style={{marginTop:10, marginBottom:10, flexDirection:"row", paddingBottom:5}}>
                    <View style={{flex:5, justifyContent:"center", alignItems:"center"}}>
                      <Text style={[styles.textSmall,]}>รายการ</Text>
                    </View>
                    <View style={{borderLeftWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:"center", alignItems:"center"}}>
                      <Text style={[styles.textSmall,]}>ราคา</Text>
                    </View>
                    <View style={{borderRightWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:3, justifyContent:"center", alignItems:"center"}}>
                      <Text style={[styles.textSmall,]}>หน่วย</Text>
                    </View>
                  </View>
                  <Divider />
                  <View style={{marginBottom:15}}>{itemDisplayArray}</View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, flexDirection:"row"}}>
            <View style={{flex:4, marginRight:5}}>
            <Button mode="contained" color={theme.COLOR_LIGHTGREY} dark={true} onPress={this._rejectQuatation}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%", color: theme.FONT_SECONDARY_COLOR}}>ปฏิเสธข้อเสนอ</Text>
            </Button>
            </View>
            <View style={{flex:5, marginLeft:5}}>
            <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this._acceptQuotation}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%"}}>ตอบรับข้อเสนอ</Text>
            </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}