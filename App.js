import React, {Component} from 'react'
import Routes from './app/Routes'

class App extends Component {
  constructor() {
    super()
    this.state = {}
    //global.refunMeId = 'L4QaaX4V2Hgi6VdTrTkA'
    global.refunMeId = 'qxNhLWm7pdzKAKu83cfQ'
  }

  async componentDidMount() {
  }
  
  render() {
    return (
      <Routes />
    );
  }
}

export default App;