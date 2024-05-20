/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {useFocusEffect} from '@react-navigation/native';

// Pre-step, call this before any NFC operations
NfcManager.start();

export default function ScanTagScreen({navigation}) {
  const [notificationText, setNotificationText] = React.useState('');
  const [isReadyToScan, setIsReadyToScan] = React.useState(false);
  const [tagText, setTagText] = React.useState('');

  const handleStartPress = async () => {
    setNotificationText('Ready to Scan');
    setIsReadyToScan(true);
    await readNdef();
  };

  const readNdef = async () => {
    if (!isReadyToScan) {
      return;
    }

    try {
      // Check if NFC is supported and enabled
      const isSupported = await NfcManager.isSupported();
      if (!isSupported) {
        Alert.alert('NFC is not supported');
        setNotificationText('NFC is not supported');
        return;
      }

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert('NFC is not enabled');
        setNotificationText('NFC is not enabled');
        return;
      }

      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Get the tag data
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);

      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecords = tag.ndefMessage;
        const textRecords = ndefRecords
          .filter(record =>
            Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT),
          )
          .map(record => Ndef.text.decodePayload(record.payload));

        if (textRecords && textRecords.length > 0) {
          const textPayload = textRecords.join('');
          setTagText(textPayload);
          setNotificationText(`Scanned Tag: ${textPayload}`);
        } else {
          setTagText('');
          setNotificationText('Tag does not contain text');
        }
      } else {
        setTagText('');
        setNotificationText('Tag does not contain NDEF message');
      }
    } catch (ex) {
      console.warn('Oops!', ex);
      setNotificationText('Failed to read tag');
      Alert.alert('Failed to read tag', ex.toString());
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsReadyToScan(true);
      return () => {
        setIsReadyToScan(false);
        NfcManager.cancelTechnologyRequest();
      };
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      <Text style={{fontSize: 18, marginBottom: 20, color: 'green'}}>
        {notificationText}
      </Text>
      <View style={{position: 'absolute', bottom: 20, width: '80%'}}>
        <Button title="Start" onPress={handleStartPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
});
