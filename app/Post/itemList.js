import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemArray: [],
    };
    this.indexItem = 0;
  }
  
  _goToSelectCate = () => { Actions.categoryselect({onPop:this._goToQuantitySelect.bind(this)}) };
  _goToQuantitySelect = (category) => {
    Actions.quantityselect({onPop:this._insertItem.bind(this), category:category})
  }

  _insertItem = (itemData) => {
    this.setState({
      itemArray: [...this.state.itemArray, itemData]
    }, () => { this.props._updateItemDataToParent(this.state.itemArray); });
    this.indexItem = this.indexItem+1;
  }

  render() {
    let itemDisplayArray = this.state.itemArray.map((item, key) => {
      return (
        <View key={"item"+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{key+1}</Text>
              </View>
              <View style={{marginLeft:5}}>
                <Icon name={item.itemData.icon} size={20} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.itemData.cateTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"center", alignItems: "center"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.itemData.quantity} {item.itemData.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    });
    
    return(
      <View style={{alignItems:"stretch", flex:1, flexDirection:"column", justifyContent:"flex-start", width:"100%"}}>
        <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
          <View>
            <Text style={[styles.textNormal, {paddingLeft:10}]}>รายการของที่ต้องการขาย</Text>
          </View>
        </View>
        <View style={{flex:1, marginTop:10, marginLeft:15, marginRight:15}}>
          <View style={{flex:1, backgroundColor:theme.COLOR_LIGHTGREY, borderRadius:10}}>
            <View style={{marginTop:10, marginBottom:10, flexDirection:"row", paddingBottom:5}}>
              <View style={{flex:3, justifyContent:"center", alignItems:"center"}}>
                <Text style={[styles.textNormal, {paddingLeft:10}]}>รายการ</Text>
              </View>
              <View style={{borderLeftWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
              <View style={{flex:2, justifyContent:"center", alignItems:"center"}}>
                <Text style={[styles.textNormal, {paddingLeft:10}]}>จำนวน</Text>
              </View>
            </View>
            <Divider />
            <View>{itemDisplayArray}</View>
            <View style={{flex:1, justifyContent:"center", alignItems:"center", marginTop:20, marginBottom:20}}>
              <Button mode="contained" color={theme.SECONDARY_COLOR} dark={true} onPress={this._goToSelectCate} style={{width:"60%"}}>
                <Text style={[styles.textNormal]}>เพิ่มรายการ</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
}