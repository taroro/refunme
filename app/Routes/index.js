import React from 'react';
import {Router, Scene, Modal, Stack, ActionConst} from 'react-native-router-flux';
import Home from '../Home'
import Step1 from '../Post';
import Step2 from '../Post/step2';
import PinMap from '../Post/pinMap';
import CategorySelect from '../Post/categorySelect';
import QuantitySelect from '../Post/quantitySelect';

const Routes = () => (
   <Router>
      <Modal hideNavBar>
         <Stack key='root'>
            <Scene key='home' component={Home} hideNavBar initial type={ActionConst.RESET} />
            <Scene key='firststep' component={Step1} hideNavBar />
            <Scene key='secondstep' component={Step2} hideNavBar />
         </Stack>
         <Scene key='pinmap' component={PinMap} hideNavBar />
         <Scene key='categoryselect' component={CategorySelect} hideNavBar />
         <Scene key='quantityselect' component={QuantitySelect} hideNavBar />
      </Modal>
   </Router>
)
export default Routes;