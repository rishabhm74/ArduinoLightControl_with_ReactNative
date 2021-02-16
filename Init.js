import React, { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';


const Init = () => {
  const [ isEnabled, setIsEnabled ] = useState(false);
  const [ discovering, setDiscovering ] = useState(false);
  const [ devices, setDevices ] = useState([]);
  const [ unpairedDevices, setUnpairedDevices ] = useState([]);
  const [ connected, setConnected ] = useState(false);
  const [ connecting, setConnecting ] = useState(false);

  useEffect(() => {
    

    return null;
  }, [])

  const connect = device => {
    setConnecting(true)
  }


  return (
    <View>
      <Text>
        Hello
      </Text>
    </View>
  )
}


export default Init;