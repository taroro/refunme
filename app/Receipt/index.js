import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, Platform} from 'react-native'
import {Button, Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import {DateFormat} from '../helpers/DateFormat'
import {Appbar} from 'react-native-paper'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay'

export default class ReceiptDetail extends Component {
  constructor(props) {
    super(props)
    this.refReceipt = firebase.firestore().collection('receipt').doc(this.props.receiptId)
    this.state = {
      loading: true,
      items: [],
      receiptId: this.props.receiptId,
      receiptDatetime: '',
    }
  }

  componentDidMount() {
    this._deLoading()
    this.unsubReceipt= this.refReceipt.onSnapshot(this._onReceiptUpdate);
  }

  componentWillUnmount() {
    this.unsubReceipt();
  }

  _onReceiptUpdate = (receiptSnapshot) => {
    var receiptData = receiptSnapshot.data();

    var promiseItems = new Promise((resolve, reject) => {
      this.refReceipt.collection('items').get().then((itemCollection) => {
        var items = [];
        itemCollection.forEach((item) => {
          var data = item.data();
          items.push({
            id: item.id,
            quantity: data.quantity,
            subCategoryTitle: data.subcate_title,
            unit: data.unit,
            price: data.price_per_unit,
          });
        });
        resolve(items);
      });
    });

    var promiseRefunMe = new Promise((resolve, reject) => {
      firebase.firestore().collection('refunme').doc(receiptData.refunme_id).get().then((refunme) => {
        this.setState({
          refunme: refunme.data().firstname + ' ' + refunme.data().lastname
        })
        resolve(refunme);
      });
    });

    var promiseRefunMan = new Promise((resolve, reject) => {
      firebase.firestore().collection('refunman').doc(receiptData.refunman_id).get().then((refunman) => {
        this.setState({
          refunman: refunman.data().firstname + ' ' + refunman.data().lastname
        })
        resolve(refunman);
      });
    });

    Promise.all([promiseItems, promiseRefunMe, promiseRefunMan]).then(([items, refunme, refunman]) => {
      this.setState({
        items: items,
        loading: false,
        receiptDatetime: receiptData.sent_datetime,
      })
    })
  }

  _deLoading = () => {
    this.setState({
      loading: false
    })
  }

  _onPressMenuButton() {
    Actions.pop()
  }

  render() {
    let receiptDate = DateFormat(this.state.receiptDatetime);
    var totalAll = 0
    let itemDisplayArray = this.state.items.map((item, key) => {
      var total = parseFloat(item.quantity) * parseFloat(item.price);
      totalAll += total
      return (
        <View key={'item'+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex: 5, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft: 10, paddingRight: 10}]}>{key+1}</Text>
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.subCategoryTitle}</Text>
              </View>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.quantity}</Text>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.price}</Text>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-end', paddingLeft: 5}}>
              <Text style={[styles.textSmall, {paddingRight: 10}]}>{total}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    });

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign: 'center', backgroundColor: theme.PRIMARY_COLOR, marginBottom: 0}}>
            <Appbar.Action icon='arrow-back' color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title='REFUN MAN'
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View>
        <View style={{flex: 1}}>
          <Spinner
            visible={this.state.loading}
            animation={'fade'}
            textContent={'รอสักครู่...'}
            textStyle={{color:theme.PRIMARY_COLOR, fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_LARGE, fontWeight: "normal"}}
          />
          <ScrollView>
            <View style={{alignItems: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', width: '100%'}}>
              <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                <View>
                  <Text style={[styles.textExtraLarge, {paddingLeft:15, paddingTop: 10, color:theme.COLOR_DARKGREY}]}>ใบรายการรับซื้อ</Text>
                </View>
                <View>
                  <Text style={[styles.textNormal, {paddingLeft:15, paddingTop: 10, color:theme.COLOR_DARKGREY2}]}>ชื่อผู้ขาย: {this.state.refunme}</Text>
                </View>
                <View>
                  <Text style={[styles.textNormal, {paddingLeft:15, paddingTop:5, color:theme.COLOR_DARKGREY2}]}>ชื่อผู้รับซื้อ: {this.state.refunman}</Text>
                </View>
                <View>
                  <Text style={[styles.textNormal, {paddingLeft:15, paddingTop: 5, color:theme.COLOR_DARKGREY2}]}>{receiptDate.today?'วันนี้':'วันที่'+receiptDate.dayFullText+' '+receiptDate.dateNum+' '+receiptDate.monthShortText+' '+receiptDate.year} {receiptDate.timeText+' น.'}</Text>
                </View>
              </View>
              <View style={{flex:1, marginTop:10, marginLeft:15, marginRight:15}}>
                <View style={{
                  backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                  borderRadius:10, width: '100%', elevation:(Platform.OS === 'ios'?0:2),
                  shadowColor: theme.BACKGROUND_PRIMARY_COLOR,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.9,
                  shadowRadius: 2}}>
                  <View style={{marginTop:10, marginBottom:10, flexDirection:'row', paddingBottom:5}}>
                    <View style={{flex:5, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>รายการ</Text>
                    </View>
                    <View style={{borderLeftWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>จำนวน</Text>
                    </View>
                    <View style={{borderRightWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>ราคา/หน่วย</Text>
                    </View>
                    <View style={{borderRightWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>รวม</Text>
                    </View>
                  </View>
                  <Divider />
                  <View>{itemDisplayArray}</View>
                  <View style={{marginTop:10, marginLeft:15, marginRight:15, marginBottom: 15, flexDirection: "row"}}>
                    <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>ยอดรวม</Text>
                    <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>{totalAll.toFixed(2)}</Text>
                    <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>บาท</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 1, marginTop:10, alignContent: "center", alignItems: "center"}}>
                <Image style={{borderRadius:10, width: 250, height: 250, alignSelf: "center"}} source={{uri:"https://promptpay.io/0825880022/"+totalAll+".png"}} />
                <Text style={[styles.textHeader, {color:theme.PRIMARY_COLOR, marginTop: 10, textAlign: "center"}]}>สแกน QR เพื่อโอนเงิน{"\n"}ผ่าน PromptPay</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}