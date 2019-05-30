import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity} from 'react-native'
import {Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import firebase from 'react-native-firebase'
import Icon from 'react-native-vector-icons/MaterialIcons'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import {DateFormat} from '../helpers/DateFormat'
import {Appbar} from 'react-native-paper'

export default class WaitingQuotation extends Component {
  constructor(props) {
    super(props)
    this.unsubscribeQuotations = null
    this.refQuotations = firebase.firestore().collection('quotation').where('post_id', '==', this.props.postId).where('status', '==', 0).orderBy('sent_datetime', 'asc');
    
    this.state = {
      postId: this.props.postId,
      quotations: [],
    }
  }

  componentDidMount() {
    this.unsubscribeQuotations = this.refQuotations.onSnapshot(this._onQuotationsUpdate);
  }

  _onQuotationsUpdate = (quotationsSnapshot) => {
    var promises = []
    quotationsSnapshot.forEach((quotation) => {
      promises.push({
        key: quotation.id,
        sentDate: quotation.data().sent_datetime,
      })
    })
    
    Promise.all(promises).then(quotations => {
      this.setState({
        quotations: quotations,
        loading: false
      })
    })
  }

  _goToQuotationDetail = (key, order) => {
    Actions.quotationdetail({
      quotationId: key.toString(),
      number: order+1
    });
  }

  _goToCompareQuotation = (key) => {
    Actions.comparequotation({
      postId: key.toString()
    });
  }

  render() {
    let quotationDisplayArray = (this.state.quotations.length > 0)?this.state.quotations.map((quotation, key) => {
      let date = DateFormat(quotation.sentDate);
      return (
        <TouchableOpacity key={'quotation'+key} onPress={() => this._goToQuotationDetail(quotation.key, key)}>
          <View style={[styles.quotationList, {flexDirection:'column', minWidth: '65%'}]} key={key}>
            <View style={{flex:2, marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
              <Icon name='face' size={80} backgroundColor={theme.COLOR_WHITE} color={theme.COLOR_DARKGREY} />
            </View>
            <View style={{flex:1, flexDirection:'row', marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
              <Icon name='star' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
              <Icon name='star' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
              <Icon name='star' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
              <Icon name='star-half' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
              <Icon name='star-border' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            </View>
            <View style={{flex:2, flexDirection:'column', marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
              <Icon.Button name='check-circle' backgroundColor={theme.PRIMARY_COLOR} color={theme.COLOR_WHITE} onPress={() => this._goToQuotationDetail(quotation.key, key)}>
                <Text style={[styles.textSmall, {color:theme.COLOR_WHITE}]}>
                  รับข้อเสนอ
                </Text>
              </Icon.Button>
            </View>
            <View style={{flex:2, flexDirection:'row', marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
              <Text style={[styles.textSmall, {textAlign:'center'}]}>{date.today?'วันนี้':'วัน'+date.dayFullText+'ที่ '+date.dateNum+' '+date.monthShortText+' '+date.year+'\n'}{'เวลา '+date.timeText+' น.'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }):null;

    return (
      <View>
        {(this.state.quotations.length >0)?
        <View style={{flexDirection: 'column', marginTop: 10, marginBottom: 10}}>
          <Text style={[{padding:10}, styles.textHeader]}>ใบเสนอราคาจาก REFUN MAN</Text>
          {(this.state.quotations.length > 1)?
          <View style={{width: '65%'}}>
            <Icon.Button name='compare' backgroundColor={theme.COLOR_DARKGREY2} color={theme.COLOR_WHITE} onPress={() => this._goToCompareQuotation(this.props.postId)}>
              <Text style={[styles.textSmall, {color:theme.COLOR_WHITE, textAlign: 'center'}]}>
                เปรียบเทียบใบเสนอราคา
              </Text>
            </Icon.Button>
          </View>:null
          }
        </View>
        :
        <View><Text style={[{padding:10}, styles.textHeader]}>ยังไม่มีใบเสนอราคาจาก REFUN MAN</Text></View>
        }
        <View style={{alignItems:(this.state.waiting)?'flex-end':'flex-start'}}>{quotationDisplayArray}</View>
      </View>
    )
  }
}