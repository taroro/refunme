import React, {Component} from 'react'
import {StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native'
import {Button, Appbar} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import { DateFormat } from '../helpers/DateFormat'

export default class Home extends Component {
  constructor() {
    super();
    this.refPostCollection = firebase.firestore().collection('post').where('refunme_id', '==', 'L4QaaX4V2Hgi6VdTrTkA');
    //this.refPostCollection = firebase.firestore().collection('post').where('refunme_id', '==', 'qxNhLWm7pdzKAKu83cfQ');
    this.state = {
      loading: false,
      posts: [],
    }
  }

  goToPost = () => {
    Actions.firststep()
  }

  componentDidMount() {
    this.unsubscribePost = this.refPostCollection.onSnapshot(this._onPostCollectionUpdate);
  }

  _onPostCollectionUpdate = (postsSnapshot) => {
    var promises = [];
    postsSnapshot.forEach(post => {
      var postId = post.id
      var postData = post.data()
      promises.push({
        postId: postId,
        availableDatetime: postData.available_datetime,
        latitude: postData.latitude,
        longitude: postData.longitude,
        postDatetime: postData.post_datetime,
        postType: postData.post_type,
        refunMeId: postData.refunme_id,
        shortAddress: postData.short_address,
        fullAddress: postData.full_address,
      })
    })

    Promise.all(promises).then(posts => {
      this.setState({
        posts: posts,
        loading: false
      })
    })
  }

  _onPressMenuButton() {

  }

  _renderEmpty() {
    return (
      <View style={{flex: 1, backgroundColor: theme.COLOR_WHITE}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <Text style={{color: theme.PRIMARY_COLOR, fontSize: 44, textAlign: 'center', fontFamily: theme.FONT_FAMILY}}>คุณไม่มีประกาศเปิดหาผู้รับซื้อในขณะนี้</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Text style={{color: theme.PRIMARY_COLOR, fontSize: 18, textAlign: 'center', fontFamily: theme.FONT_FAMILY}}>เปิดประกาศขายเลือก REFUN MAN รับซื้อ</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Button mode='contained' color='#9BC73C' dark={true} onPress={this.goToPost}>
            <Text style={{fontSize: 18, textAlign: 'center', fontFamily: theme.FONT_FAMILY, width: '100%'}}>ประกาศหาผู้รับซื้อ</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }

  _renderPost() {
    let postDisplayArray = this.state.posts.map((post, key) => {
      let date = DateFormat(post.availableDatetime);
      let postDate = DateFormat(post.postDatetime);

      return (
        <TouchableOpacity key={post.postId} onPress={() => this._goToPostDetail(post.postId)}>
          <View style={[styles.postList, {flexDirection: 'column'}]}>
            <View style={{flex: 2, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                  <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: theme.PRIMARY_COLOR, padding: 5, width: '100%', borderRadius: 20}}>
                    <Text style={[styles.textHeader, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>{date.dayFullText}</Text>
                    <Text style= {[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginTop: -15, marginBottom: -10}]}>{date.dateNum}</Text>
                  </View>
                </View>
                <View style={{flex: 5, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 20, paddingTop: 5}}>
                  <Text style={[styles.textHeader, {color: theme.COLOR_DARKGREY, textAlign: 'left'}]}>{date.monthFullText+' '+date.year}</Text>
                  <Text style={[styles.textExtraLarge, {color: theme.PRIMARY_COLOR, textAlign: 'left'}]}>เวลา {date.timeText}</Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
              <Text style={[styles.textTiny]}>ประกาศ{postDate.today?'วันนี้':'เมื่อวัน'+postDate.dayFullText+' '+postDate.dateNum+' '+postDate.monthShortText+' '+postDate.year} {postDate.timeText+' น.'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={{flex: 1, backgroundColor: theme.BACKGROUND_PRIMARY_COLOR}}>
        <ScrollView>
          <View style={{alignItems: 'stretch', justifyContent: 'center', padding: 10}}>{postDisplayArray}</View>
        </ScrollView>
        <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, backgroundColor: theme.PRIMARY_COLOR}}>
          <Text style={[styles.textSmall, {padding: 10, color: theme.COLOR_WHITE, justifyContent: 'center', textAlign: 'center', width: '100%'}]}>คุณไม่สามารถเปิดประกาศใหม่ได้ {'\n'} ขณะที่มีประกาศกำลังทำงานอยู่</Text>
        </View>
      </View>
    )
  }

  componentWillUnmount() {
    this.unsubscribePost();
  }

  _goToPostDetail = key => {
    Actions.postdetail({
      postId: key.toString()
    });
  }

  render() {

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign: 'center', backgroundColor: theme.PRIMARY_COLOR, marginBottom: 0}}>
            <Appbar.Action icon='menu' color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title='REFUN ME'
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View>
        { this.state.posts.length > 0? this._renderPost():this._renderEmpty() }
      </SafeAreaView>
    );
  }
}
