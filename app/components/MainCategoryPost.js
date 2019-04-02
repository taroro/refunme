import React from 'react';
import { 
  TouchableHighlight,
  View,
  Text 
} from 'react-native';

export default class MainCategoryPost extends React.PureComponent {
  _getSubCate() {
    
  }

  render() {
    return (
      <TouchableHighlight onPress={this._getSubCate}>
        <View style={{
          backgroundColor:theme.BACKGROUND_SECONDARY_COLOR,
          width: 80,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          marginLeft:5,
          marginRight:5,
        }}>
          <Icon
            name="star"
            size={35}
            backgroundColor={theme.COLOR_WHITE}
            color={theme.PRIMARY_COLOR} />
          <Text style={[styles.textTiny]}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>

    );
  }
}