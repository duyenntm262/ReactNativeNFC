import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {useFocusEffect} from '@react-navigation/native';

// Pre-step, call this before any NFC operations
NfcManager.start();

export default function WriteTagScreen({navigation}) {
  const [textToWrite, setTextToWrite] = useState('');
  const [message, setMessage] = useState('');

  const handleWritePress = async () => {
    try {
      // Check if NFC is supported and enabled
      const isSupported = await NfcManager.isSupported();
      if (!isSupported) {
        Alert.alert('NFC is not supported');
        return;
      }

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert('NFC is not enabled');
        return;
      }

      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Create a message to write
      const bytes = Ndef.encodeMessage([Ndef.textRecord(textToWrite)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        setMessage('Written to tag successfully!');
      }
    } catch (ex) {
      console.warn('Oops!', ex);
      setMessage('Failed to write text to tag');
    } finally {
      // Stop the NFC scanning
      NfcManager.cancelTechnologyRequest();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Reset state khi màn hình được focus
      setTextToWrite('');
      setMessage('');

      return () => {
        // Any cleanup actions when leaving the screen
      };
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder="Enter text to write to tag"
        color="black"
        value={textToWrite}
        onChangeText={setTextToWrite}
      />
      <Button title="Write to Tag" onPress={handleWritePress} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});
