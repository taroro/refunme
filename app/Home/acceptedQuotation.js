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

export default class AcceptedQuotation extends Component {
  constructor(props) {
    super(props)
    this.unsubscribeQuotations = null
    this.unsubscribeChat = null
    this.refQuotations = firebase.firestore().collection('quotation').doc(this.props.quotationId);
    this.refChatCollection = this.refQuotations.collection('chat').orderBy('send_datetime')
    
    this.state = {
      quotationId: this.props.quotationId,
      quotation: [],
      message: '',
      chats: [],
      chatSender: '',
    }
  }

  componentDidMount() {
    this.unsubscribeQuotations = this.refQuotations.onSnapshot(this._onQuotationDocumentUpdate);
    this.unsubscribeChat = this.refChatCollection.onSnapshot(this._onChatUpdate);
  }

  _onChatUpdate = (chatsCollection) => {
    var chats = [];
    chatsCollection.forEach((chat) => {
      var data = chat.data();
      chats.push({
        message: data.message,
        sendDatetime: data.send_datetime,
        sender: data.sender,
        receiver: data.receiver,
      });
    });
    this.setState({
      chats: chats
    })
  }

  _onQuotationDocumentUpdate = (quotationSnapshot) => {
    var quotationId = quotationSnapshot.id
    var quotation = quotationSnapshot.data()
    var chatSender = quotation.refunme_id
    var promises = []
    promises.push(
      firebase.firestore().collection('refunman').doc(quotation.refunman_id).get().then((refunman) => {
        return {
          key: quotationId,
          sentDate: quotation.sent_datetime,
          refunManName: refunman.data().firstname+' '+refunman.data().lastname,
        }
      })
    )
    
    Promise.all(promises).then(quotation => {
      this.setState({
        quotation: quotation,
        loading: false,
        chatSender: chatSender
      })
    })
  }

  render() {
    let quotation = this.state.quotation[0]
    let chatsDisplay = (this.state.chats.length > 0 && this.state.chatSender !== '')?this.state.chats.map((chat, key) => {
      return (
        <View key={'chat'+key} style={{width: '100%', margin: 10}}>
          {(this.state.chatSender === chat.sender)?
          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <View style={{width: '65%', borderRadius: 10, backgroundColor:theme.PRIMARY_COLOR, padding: 10, marginRight: 20}}>
            <Text style={[styles.textNormal, {color: theme.COLOR_WHITE}]}>{chat.message}</Text></View>
          </View>
          :
          <View style={{width: '100%', alignItems: 'flex-start'}}>
            <View style={{width: '65%', borderRadius: 10, backgroundColor:theme.COLOR_WHITE, padding: 10, marginRight: 20}}>
            <Text style={[styles.textNormal, {color: theme.COLOR_DARKGREY}]}>{chat.message}</Text></View>
          </View>
        }
        </View>
      )
    }):null

    return (
      <View>
        <View><Text style={[{padding:10, textAlign:'center', width:'100%'}, styles.textHeader]}>REFUN MAN ที่คุณเลือก</Text></View>
        <View style={{alignItems:(this.state.waiting)?'flex-end':'flex-start'}}>
          {(quotation)?
          <View style={[styles.quotationList, {flexDirection:'column'}]}>
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
            <View>
              <Text style={[styles.textHeader, {textAlign:'center', color:theme.COLOR_DARKGREY}]}>{quotation.refunManName}</Text>
            </View>
            <View style={{flex:2, flexDirection:'row', marginTop:5, marginBottom:5, justifyContent:'center', alignItems:'center'}}>
              <Text style={[styles.textNormalGreen, {textAlign:'center'}]}>ถูกรับเลือกแล้ว</Text>
            </View>
          </View>:null
          }
        </View>
        <View style={{flex: 1, widht: '100%', margin: 10}}>{chatsDisplay}</View>
      </View>
    )
  }
}