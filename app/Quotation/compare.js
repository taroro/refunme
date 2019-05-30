import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, TextInput, Dimensions} from 'react-native'
import {Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import firebase from 'react-native-firebase'
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import {DateFormat} from '../helpers/DateFormat'
import {Appbar} from 'react-native-paper'
import moment from 'moment';


export default class CompareQuotation extends Component {
  constructor(props) {
    super(props)
    this.unsubscribeQuotationCompare = null
    this.refQuotation = firebase.firestore().collection('quotation')
    this.refQuotationCollection = this.refQuotation.where('post_id', '==', this.props.postId).where('status', '==', 0).orderBy('sent_datetime', 'asc');
    
    this.state = {
      postId: this.props.postId,
      loading: true,
      categoryQuotation: [],
      refunMans: [],
      cateItemListArray: [],
    }
  }

  componentDidMount() {
    this.unsubscribeQuotationCompare = this.refQuotationCollection.onSnapshot(this._onQuotationsUpdate)
  }

  componentWillUnmount() {
    this.unsubscribeQuotationCompare()
  }

  _getCategoryQuotation = (quotationId) => {
    return new Promise((resolve, reject) => {
      this.refQuotation.doc(quotationId).collection('items').get().then((itemCollection) => {
        var items = [];
        itemCollection.forEach((item) => {
          items.push({cateId: item.data().subcate_id, cateTitle: item.data().subcate_title, unit: item.data().unit,});
        });
        resolve(items);
      });
    });
  }

  _getRefunManQuotation = (refunManId, quotation) => {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('refunman').doc(refunManId).get().then((refunman) => {
        resolve({id: refunman.id, firstname: refunman.data().firstname, lastname: refunman.data().lastname, quotationId: quotation,})
      })
    })
  }

  _getCateItem = (cateId, quotationId) => {
    return new Promise((resolve, reject) => {
      this.refQuotation.doc(quotationId).collection('items').where('subcate_id', '==', cateId).get().then((items) => {
        var returnData = {}
        if(!items.empty) {
          items.forEach((item) => {
            returnData = {pricePerUnit: item.data().price_per_unit, unit: item.data().unit,}
          })
        } else {
          returnData = {pricePerUnit: 0, unit: '',}
        }
        resolve(returnData)
      })
    })
  }

  _onQuotationsUpdate = (quotationsSnapshot) => {
    var promiseCate = []
    var promiseRefunMan = []
    quotationsSnapshot.forEach((quotation) => {
      promiseCate.push(this._getCategoryQuotation(quotation.id))
      promiseRefunMan.push(this._getRefunManQuotation(quotation.data().refunman_id, quotation.id))
    })
    Promise.all(promiseCate).then((allCate) => {
      var categoryQuotation = [];
      allCate.forEach((cates) => {
        categoryQuotation = [...categoryQuotation, ...cates]
      })
      const result = [];
      const map = new Map();
      for (const item of categoryQuotation) {
        if(!map.has(item.cateId)){
          map.set(item.cateId, true);
          result.push({cateId: item.cateId, cateTitle: item.cateTitle, unit: item.unit,});
        }
      }
      this.setState({
        categoryQuotation: result
      }, () => {
        Promise.all(promiseRefunMan).then((refunmans) => {
          this.setState({
            refunMans: refunmans
          }, () => {
            var promiseCateItem = []
            this.state.categoryQuotation.forEach((cate) => {
              var cateItems = {cateTitle: cate.cateTitle, unit: cate.unit, items: [],}
              this.state.refunMans.forEach((refunman) => {
                cateItems.items.push(this._getCateItem(cate.cateId, refunman.quotationId))
              })
              promiseCateItem.push(cateItems)
            })

            Promise.all(promiseCateItem).then((cateItemList) => {
              cateItemList.forEach((data) => {
                var cateItem = {cateTitle: data.cateTitle, unit: data.unit, items: [], maxPrice: 0,}
                Promise.all(data.items).then((item) => {
                  cateItem.maxPrice = Math.max.apply(Math, item.map(function(o) { return o.pricePerUnit; }))
                  cateItem.items.push(item)
                }).then(() => {
                  this.setState(prevState => ({
                    cateItemListArray: [...prevState.cateItemListArray, cateItem]
                  }))
                })
              })
            })
          })
        })
      })
    })
  }

  _onPressMenuButton() {
    Actions.pop();
  }

  _goToQuotationDetail = (key, order) => {
    Actions.quotationdetail({
      quotationId: key.toString(),
      number: order+1
    });
  }

  render() {
    let cateItemListArrayDisplay = (this.state.cateItemListArray.length == this.state.categoryQuotation.length)?this.state.cateItemListArray.map((cate, key) => {
      let renderPrice = cate.items[0].map((item, key) => {
        let price = (item.pricePerUnit == 0)?"-":item.pricePerUnit+" บาท"
        let color = (item.pricePerUnit == cate.maxPrice)?theme.PRIMARY_COLOR:theme.FONT_PRIMARY_COLOR
        return (
          <View key={'item'+key} style={{
            flexDirection:'column', height: 50, width: 150, marginRight: 10, 
            justifyContent: 'center', alignContent: 'center', alignItems: 'center',
            shadowColor: theme.BACKGROUND_PRIMARY_COLOR, shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.9, shadowRadius: 2,
            borderBottomStartRadius: 10, borderBottomEndRadius: 10, backgroundColor: theme.COLOR_WHITE}}>
            <Text style={[styles.textNormal, {textAlign: 'center', color: color}]}>{price}</Text>
          </View>
        )
      })

      return (
        <View style={{width: '100%', flexDirection: 'column', marginBottom: 10}} key={'cate'+key}>
          <View style={{backgroundColor: theme.COLOR_DARKGREY2, borderTopStartRadius: 5, borderTopEndRadius: 5, marginBottom: 5, padding: 5, marginRight: 10}}>
            <Text style={[styles.textNormal, {color:theme.COLOR_WHITE}]}>{cate.cateTitle} ({cate.unit})</Text>
          </View>
          <View style={{flexDirection: 'row'}}>{renderPrice}</View>
        </View>
      )
    }):null

    let refunmanDisplayArray = (this.state.refunMans.length > 0)?this.state.refunMans.map((refunman, key) => {
      return (
        <View style={[styles.quotationList, {flexDirection:'column', width: 150, marginRight: 10}]} key={"refunman"+key}>
          <View style={{marginBottom:5, justifyContent:'center', alignItems:'center'}}>
            <Icon name='face' size={50} backgroundColor={theme.COLOR_WHITE} color={theme.COLOR_DARKGREY} />
          </View>
          <View><Text style={[styles.textTiny, {textAlign: 'center'}]}>REFUN MAN #{key+1}</Text></View>
          <View style={{flexDirection:'row', marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
            <Icon name='star' size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            <Icon name='star' size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            <Icon name='star' size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            <Icon name='star-half' size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            <Icon name='star-border' size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
          </View>
          <View style={{flexDirection:'column', marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
            <Icon.Button name='check-circle' backgroundColor={theme.PRIMARY_COLOR} color={theme.COLOR_WHITE} onPress={() => this._goToQuotationDetail(refunman.quotationId, key)}>
              <Text style={[styles.textTiny, {color:theme.COLOR_WHITE}]}>
                รับข้อเสนอ
              </Text>
            </Icon.Button>
          </View>
        </View>
      );
    }):null;

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign: 'center', backgroundColor: theme.PRIMARY_COLOR, marginBottom: 0}}>
            <Appbar.Action icon='arrow-back' color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title='เปรียบเทียบใบเสนอราคา'
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View>
        <View style={{flex: 1}}>
          <ScrollView horizontal>
            <View style={{flexDirection: 'column', flex: 1, padding: 10}}>
              <View style={{flexDirection: 'row', height: 200, marginTop: 20}}>
                {refunmanDisplayArray}
              </View>
              <View style={{flex: 4}}>
                <ScrollView>
                  <View style={{flexDirection: 'column'}}>
                    {cateItemListArrayDisplay}
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}