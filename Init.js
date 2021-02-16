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
import { BluetoothSerial } from 'react-native-bluetooth-serial';


const Init = () => {
  const [ isEnabled, setIsEnabled ] = useState(false);
  const [ isDiscovering, setIsDiscovering ] = useState(false);
  const [ devices, setDevices ] = useState([]);
  const [ unpairedDevices, setUnpairedDevices ] = useState([]);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ isConnecting, setIsConnecting ] = useState(false);

  useEffect(() => {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled1, devices1 ] = values;
      setIsEnabled(isEnabled1);
      setDevices(devices1);
    })

    // BluetoothSerial.on('bluetoothEnabled', () => {
    //   Promise.all([
    //     BluetoothSerial.isEnabled(),
    //     BluetoothSerial.list()
    //   ])
    //   .then((values) => {
    //     const [ isEnabled, devices ] = values;
    //     setDevices(devices)
    //   })

    //   BluetoothSerial.on('bluetoothDisabled', () => {
    //     setDevices([]);
    //   })

    //   BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
    // })

    return null;
  }, [])

  BluetoothSerial.on('bluetoothEnabled', () => {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values;
      setDevices(devices)
    })
  })

    BluetoothSerial.on('bluetoothDisabled', () => {
      setDevices([]);
    })

    BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
  


  const connect = device => {
    setConnecting(true);
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device ${device.name}`);
      ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);
    })
    .catch((err) => console.log((err.message)))
  }

  const _renderItem = item => {
    return (
      <TouchableOpacity
        onPress={() => connect(item.item)}
      >
        <View style={styles.deviceNameWrap}> 
          <Text style={styles.deviceName}>
            {
              item.item.name ?
              item.item.name :
              item.item.id
            }
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const enable = () => {
    BluetoothSerial.enable()
    .then((res) => setIsEnabled(true))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  const disable = () => {
    BluetoothSerial.disable()
    .then((res) => setIsEnabled(false))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  const toggleBluetooth = value => {
    if ( value === true ) {
      enable();
    } else {
      disable();
    }
  }

  const discoverAvailableDevices = () => {
    if ( isDiscovering ) {
      return false;
    } else {
      setIsDiscovering(true);
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
        console.log(uniqueDevices);
        setUnpairedDevices(uniqueDevices);
        setIsDiscovering(false);
      })
      .catch((err) => console.log(err.message))
    }
  }

  const toggleSwitch = () => {
    BluetoothSerial.write("T")
    .then((res) => {
      console.log(res);
      console.log('Successfully wrote to device');
      setIsConnected(true);
    })
    .catch((err) => console.log(err.message))
  }

  return (
    <View styles={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>
          Bluetooth Devices List
        </Text>
        <View style={styles.toolbarButton}>
          <Switch 
            value={isEnabled}
            onValueChange={(val) => toggleBluetooth(val)}
          />
        </View>
      </View>
      <Button 
        onPress={() => discoverAvailableDevices()}
        title="Scan for Devices"
        color="#841584"
      />
      <FlatList 
        style={{ flex: 1 }}
        data={devices}
        keyExtractor={item => item.id}
        renderItem={(item) => _renderItem(item)}
      />
      <Button 
        onPress={() => toggleSwitch()}
        title="Switch(On/Off)"
        color="#841584"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar:{
    paddingTop:30,
    paddingBottom:30,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    marginTop: 8,
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    marginTop:6
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  }
});


export default Init;