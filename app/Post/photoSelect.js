import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';

export default class PhotoSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      photoArray: [],
    };
    this.indexPhoto = 0;
  }

  _handleChoosePhoto = () => {
    const options = {};
    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        let dataValue = {uri:response.uri};
        this.setState({
          photoArray: [...this.state.photoArray, dataValue]
        }, () => { this.props._updatePhotoDataToParent(this.state.photoArray); });
        this.indexPhoto = this.indexPhoto+1;
      }
    });
  };

  render () {
    let photoDisplayArray = this.state.photoArray.map((item, key) => {
      return (
        <Image key={"photo"+key} style={[styles.thumbnailPhoto]} source={{uri:item.uri}} />
      );
    });

    return(
      <View style={{alignItems:"stretch", flex:1, flexDirection:"column", justifyContent:"flex-start", width:"100%"}}>
        <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
          <View>
            <Text style={[styles.textNormal, {paddingLeft:10}]}>อัพโหลดรูปภาพ</Text>
          </View>
        </View>
        <View style={[styles.postPhotoContainer]}>
          {photoDisplayArray}
          <TouchableOpacity onPress={this._handleChoosePhoto}>
            <View style={[styles.postAddPhotoButton]}>
              <Icon name="plus" size={35} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}