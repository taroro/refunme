import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import TextBoxDisabled from '../components/TextBoxDisabled';

export default class DateTimeSelect extends Component {
  constructor() {
    super();
    this.state = {
      isDateTimePickerVisible: false,
      chosenDate: 'วว/ดด/ปป'
    };
  }
  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});
  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});
  _handleDatePicked = (date) => {
    this.setState({
      chosenDate: moment(date).format('DD/MM/YYYY HH:mm')
    }, () => {this._updateToParent(moment(date).format('DD/MM/YYYY HH:mm'));})
    this._hideDateTimePicker();
  };

  _updateToParent = (dateTime) => {
    this.props._updateDateTimeToParent(dateTime)
  }

  render() {
    const chosenDate = this.state.chosenDate;

    return (
      <View style={{marginTop: 20, marginLeft: 15, marginRight: 15}}>
        <View><Text style={[styles.textNormal, {paddingLeft: 10}]}>ระบุวันที่สะดวก</Text></View>
        <View style={{
          backgroundColor: theme.BACKGROUND_SECONDARY_COLOR, 
          borderRadius: 10,
          width: '100%'
        }}>
          <View style={{height: 55, flexDirection: 'row'}}>
            <View style={{width: 70, justifyContent: 'center', alignItems: 'center'}}>
              <Icon
                name="calendar"
                size={35}
                backgroundColor={theme.COLOR_WHITE}
                color={theme.PRIMARY_COLOR}
              />
            </View>
            <View style={{justifyContent: 'center', flex: 1, paddingRight: 10}}>
              <TouchableOpacity onPress={this._showDateTimePicker} >
                <TextBoxDisabled title={chosenDate} />
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                datePickerModeAndroid='spinner'
                titleIOS='เลือกวันที่สะดวก'
                mode='datetime'
                minimumDate={new Date()}
                cancelTextIOS='ยกเลิก'
                confirmTextIOS='ตกลง'
                is24Hour={false}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}