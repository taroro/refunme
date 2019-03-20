import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import {Button} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
// Custom Components
import NavBarRefun from '../components/NavBarRefun';
import theme from '../styles/theme.style';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  goToPost = () => {
    Actions.post()
  }

  async componentDidMount() {
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <NavBarRefun title='REFUN ME' />
        <ScrollView contentContainerStyle={styles.container} >
          <View style={{ flex: 1, top:60, justifyContent: 'center', alignItems: 'center', width:"80%"  }}>
            <Text style={{ color:theme.PRIMARY_COLOR, fontSize: 44, textAlign:"center", fontFamily:theme.FONT_FAMILY }}>คุณไม่มีประกาศเปิดหาผู้รับซื้อในขณะนี้</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ color:theme.PRIMARY_COLOR, fontSize: 18, textAlign:"center", fontFamily:theme.FONT_FAMILY  }}>เปิดประกาศขายเลือก REFUN MAN รับซื้อ</Text>
            </View>
            <View style={{ marginTop: 10}}>
              <Button mode="contained" color="#9BC73C" dark={true} onPress={this.goToPost}>
              <Text style={{ fontSize: 18, textAlign:"center", fontFamily:theme.FONT_FAMILY, width:"80%"  }}>ประกาศหาผู้รับซื้อ</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
});
