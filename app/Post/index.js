import React, {Component} from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  ImageBackground, 
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { 
  Button, 
  RadioButton, 
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Actions} from 'react-native-router-flux';
// Custom Components
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';
import TextBoxDisabled from '../components/TextBoxDisabled';

class Post extends Component {
  constructor() {
    super();
    this.state = {
      checked:'fast',
      latitude:'0.00000',
      longitude:'0.00000',
    };
  }

  goToHome = () => { Actions.home() }
  goToStep2 = () => { }
  goToPinMap = () => { Actions.pinmap({onPop: this.BacktoFirstPage.bind(this)}) }
  gotoChooseDate = () => { }

  BacktoFirstPage(location){
    this.setState({
      latitude: location.latitude,
      longitude: location.longitude,
      checked: this.state.checked
    });
  }

  render() {
    const checked = this.state.checked;
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top:'always'}}>
        <NavBarRefun title='ประกาศขาย' action='home' />
        <View style={{ 
          alignItems:'stretch', 
          flexDirection:'column', 
          justifyContent:'flex-start', 
          width:'100%',}}>
          <View style={{ 
            alignItems:'center', 
            backgroundColor:theme.BACKGROUND_SECONDARY_COLOR,
            paddingBottom:5,  
            paddingTop:5, 
            width:'100%',}}>
            <Image source={require('../assets/images/steps01.png')} />
          </View>
        </View>
        <View style={{flex:1}} >
          <ScrollView>
          <View style={{ 
                alignItems:'stretch', 
                flex:1, 
                flexDirection:'column', 
                justifyContent:'flex-start', 
                width:'100%',}}>
                <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                    <View><Text style={[styles.textNormal, {paddingLeft:10}]}>เลือกรูปแบบประกาศ</Text></View>
                    <View style={{ 
                        backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                        borderRadius:10,
                        width:'100%',}}>
                        <View style={{height:75, flexDirection:'row'}}>
                            <View style={{ width: 60, justifyContent:'center', alignItems:'center' }}>
                                <RadioButton
                                    color={theme.PRIMARY_COLOR}
                                    value='fast'
                                    status={checked === 'fast'?'checked':'unchecked'}
                                    onPress={() => {this.setState({checked:'fast'});}}
                                />
                            </View>
                            <View style={{justifyContent:'center'}}>
                                <Text style={[styles.textNormal]}>ประกาศขายภายใน 24 ชม</Text>
                                <Text style={[styles.textTiny]}>หาผู้ซื้อได้เร็ว ราคาตามที่ผู้ซื้อกำหนด</Text>
                            </View>
                        </View>
                        <Divider />
                        <View style={{height:75, flexDirection:'row'}}>
                            <View style={{width:60, justifyContent:'center', alignItems:'center'}}>
                                <RadioButton
                                    color={theme.PRIMARY_COLOR}
                                    value='normal'
                                    status={checked === 'normal'?'checked':'unchecked'}
                                    onPress={() => {this.setState({checked:'normal'});}}
                                />
                            </View>
                            <View style={{justifyContent:'center'}}>
                                <Text style={[styles.textNormal]}>ประกาศขายแบบเปิดรับข้อเสนอ</Text>
                                <Text style={[styles.textTiny]}>ผู้ขายสามารถรับข้อเสนอราคาจาก REFUN MAN</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                    <View><Text style={[styles.textNormal, {paddingLeft:10}]}>ระบุวันที่สะดวก</Text></View>
                    <View style={{
                        backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                        borderRadius:10,
                        width:'100%',}}>
                        <View style={{height:55, flexDirection:'row'}}>
                            <View style={{width:70, justifyContent:'center', alignItems:'center'}}>
                                <Icon
                                    name="calendar"
                                    size={35}
                                    backgroundColor={theme.COLOR_WHITE}
                                    color={theme.PRIMARY_COLOR}
                                />
                            </View>
                            <View style={{justifyContent:'center', flex:1, paddingRight:10}}>
                                <TouchableOpacity onPress={this.gotoChooseDate} >
                                    <TextBoxDisabled title='วว/ดด/ปป' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                    <View><Text style={[styles.textNormal, {paddingLeft:10}]}>ระบุพิกัดตำแหน่งบ้าน</Text></View>
                    <View style={{
                        backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                        borderRadius:10,
                        width:'100%',}}>
                        <View style={{height:55, flexDirection:'row'}} >
                            <View style={{width:70, justifyContent:'center', alignItems:'center'}}>
                                <Icon
                                    name="location-pin"
                                    size={35}
                                    backgroundColor={theme.COLOR_WHITE}
                                    color={theme.PRIMARY_COLOR}
                                />
                            </View>
                            <View style={{justifyContent:'center', flex:1, paddingRight:10}}>
                                <TouchableOpacity onPress={this.goToPinMap} >
                                    <TextBoxDisabled title={latitude+', '+longitude} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{width:"100%", height:150}}>
                        <TouchableOpacity onPress={this.goToPinMap} >
                            <ImageBackground 
                                source={require('../assets/images/mapmockup.png')} 
                                style={{width:'100%', height:150, justifyContent:'center', alignItems:'center'}} >
                                <Button 
                                    mode="contained" 
                                    color={theme.SECONDARY_COLOR} 
                                    dark={true} 
                                    style={{width:"60%"}}>
                                    <Text style={[styles.textNormal]}>คลิกเพื่อระบุพิกัด</Text>
                                </Button>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
          </ScrollView>
          <View style={{marginTop:10, marginLeft: 15, marginRight: 15, marginBottom:10}}>
            <Button mode="contained" color="#9BC73C" dark={true} onPress={this.goToStep2}>
              <Text style={{fontSize: 18, textAlign:"center", fontFamily: theme.FONT_FAMILY, width:"80%" }}>ต่อไป</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
export default Post