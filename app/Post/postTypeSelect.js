import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {RadioButton, Divider} from 'react-native-paper';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';

export default class PostTypeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:1
    };
  }

  _handleRadioBox = (data) => {
    this.setState({
      type:data
    }, () => {this.props._updatePostTypeToParent(data)});
  }

  render() {
    const type = this.state.type;

    return (
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
                        value={1}
                        status={type === 1?'checked':'unchecked'}
                        onPress={() => {this._handleRadioBox(1);}}
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
                        value={0}
                        status={type === 0?'checked':'unchecked'}
                        onPress={() => {this._handleRadioBox(0);}}
                    />
                </View>
                <View style={{justifyContent:'center'}}>
                    <Text style={[styles.textNormal]}>ประกาศขายแบบเปิดรับข้อเสนอ</Text>
                    <Text style={[styles.textTiny]}>ผู้ขายสามารถรับข้อเสนอราคาจาก REFUN MAN</Text>
                </View>
            </View>
        </View>
    </View>
    )
  }
}