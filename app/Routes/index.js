import React from 'react';
import { Router, Scene, Modal, Stack, ActionConst } from 'react-native-router-flux';
import Home from '../Home'
import Post from '../Post';
import PinMap from '../Post/pinMap';

const stateHandler = (prevState, newState, action) => {
   console.warn('onStateChange: ACTION:', action);
 };

const Routes = () => (
   <Router>
      <Stack key='root'>
         <Scene key='home' component={Home} hideNavBar initial type={ActionConst.RESET} />
         <Stack key='post' hideNavBar>
            <Scene key='firstStep' component={Post} hideNavBar />
            <Scene key='pinmap' component={PinMap} hideNavBar />
         </Stack>
      </Stack>
   </Router>
)
export default Routes;