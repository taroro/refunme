import React, {Component} from 'react'
import {StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native'
import {Button, Appbar} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import { DateFormat } from '../helpers/DateFormat'
import Spinner from 'react-native-loading-spinner-overlay';

export default class Home extends Component {
  constructor() {
    super();
    this.refActivePost = firebase.firestore().collection('post')
      .where('refunme_id', '==', global.refunMeId)
      .where('status', '<', 3)
    this.refArchivePost = firebase.firestore().collection('post')
      .where('refunme_id', '==', global.refunMeId)
      .where('status', '==', 3)

    this.state = {
      loading: false,
      activePosts: [],
      archivePosts: [],
    }
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    this.unsubActivePost = this.refActivePost.onSnapshot(this._onActivePostUpdate);
    this.unsubArchivePost = this.refArchivePost.onSnapshot(this._onArchivePostUpdate);
  }

  componentWillUnmount() {
    this.unsubActivePost();
    this.unsubArchivePost();
  }

  _onActivePostUpdate = (postsSnapshot) => {
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
        activePosts: posts,
        loading: false
      })
    })
  }

  _onArchivePostUpdate = (postsSnapshot) => {
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
        archivePosts: posts,
        loading: false
      })
    })
  }

  _onPressMenuButton() {

  }

  _goToPostDetail = key => {
    Actions.postdetail({
      postId: key.toString()
    });
  }

  goToPost = () => {
    Actions.firststep()
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

  _renderActivePost() {
    let postDisplayArray = this.state.activePosts.map((post, key) => {
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
      <View>
        <View><Text style={[{marginTop: 10, paddingLeft: 10, textAlign:'center', width:'100%'}, styles.textHeader]}>ประกาศที่กำลังทำงาน</Text></View>
        <View style={{alignItems: 'stretch', justifyContent: 'center', padding: 10}}>{postDisplayArray}</View>
      </View>
    )
  }

  _renderArchivePost() {
    let postDisplayArray = this.state.archivePosts.map((post, key) => {
      let date = DateFormat(post.availableDatetime);
      let postDate = DateFormat(post.postDatetime);

      return (
        <TouchableOpacity key={post.postId} onPress={() => this._goToPostDetail(post.postId)}>
          <View style={[styles.postList, {flexDirection: 'column'}]}>
            <View style={{flex: 2, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                  <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: theme.COLOR_DARKGREY2, padding: 5, width: '100%', borderRadius: 20}}>
                    <Text style={[styles.textHeader, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>{date.dayFullText}</Text>
                    <Text style= {[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginTop: -15, marginBottom: -10}]}>{date.dateNum}</Text>
                  </View>
                </View>
                <View style={{flex: 5, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 20, paddingTop: 5}}>
                  <Text style={[styles.textHeader, {color: theme.COLOR_DARKGREY2, textAlign: 'left'}]}>{date.monthFullText+' '+date.year}</Text>
                  <Text style={[styles.textExtraLarge, {color: theme.COLOR_DARKGREY2, textAlign: 'left'}]}>เวลา {date.timeText}</Text>
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
      <View>
        <View><Text style={[{marginTop: 10, paddingLeft: 10, textAlign:'center', width:'100%'}, styles.textHeader]}>ประกาศที่สำเร็จแล้ว</Text></View>
        <View style={{alignItems: 'stretch', justifyContent: 'center', padding: 10}}>{postDisplayArray}</View>
      </View>
    )
  }

  _renderPost() {
    if(this.state.activePosts.length > 0 || this.state.archivePosts.length > 0) {
      var activePost = null
      var archivePost = null
      if(this.state.activePosts.length > 0) {
        activePost = this._renderActivePost()
      }
      if(this.state.archivePosts.length > 0) {
        archivePost = this._renderArchivePost()
      }

      return (
        <View style={{flex: 1, backgroundColor: theme.BACKGROUND_PRIMARY_COLOR}}>
          <ScrollView>
            {activePost}
            {archivePost}
          </ScrollView>
          {
            (this.state.activePosts.length > 0)?
              <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, backgroundColor: theme.PRIMARY_COLOR}}>
                <Text style={[styles.textSmall, {padding: 10, color: theme.COLOR_WHITE, justifyContent: 'center', textAlign: 'center', width: '100%'}]}>คุณไม่สามารถเปิดประกาศใหม่ได้ {'\n'} ขณะที่มีประกาศกำลังทำงานอยู่</Text>
              </View>:
              <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, backgroundColor: theme.PRIMARY_COLOR, alignItems: "center"}}>
                <Text style={[styles.textSmall, {padding: 10, color: theme.COLOR_WHITE, justifyContent: 'center', textAlign: 'center', width: '100%'}]}>เปิดประกาศขายเลือก REFUN MAN รับซื้อ</Text>
                <Button mode="contained" color={theme.COLOR_LIGHTGREY} dark={true}  onPress={this.goToPost} style={{width: "80%", marginBottom: 10}}>
                  <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%", color: theme.COLOR_DARKGREY}}>เปิดประกาศใหม่</Text>
                </Button>
              </View>
          }
        </View>
      )
    } else {
      return this._renderEmpty()
    }
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
        <Spinner
          visible={this.state.loading}
          animation={'fade'}
          textContent={'รอสักครู่...'}
          textStyle={{color:theme.PRIMARY_COLOR, fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_LARGE, fontWeight: "normal"}}
        />
        {
          (!this.state.loading)?this._renderPost():null
        }
      </SafeAreaView>
    );
  }
}
