import React, { FC } from 'react';
import { Button, StyleSheet, View, Text, KeyboardAvoidingView, SafeAreaView, TextInput } from 'react-native';
import { RootStackScreenProps } from '../navigators/types';
import { BaseCoin, baseCrypto, ENetwork, INetwork } from '@ngrave/baseprotocol';
import { Avax, Stub as AvaxStub } from '@ngrave/avax';

type Props = RootStackScreenProps<'Home'>;

const avv = new Avax({
  network: 'testnet',
  external: {
    network: 'testnet',
    rpcUrl: 'api.avax-test.network',
    chainId: 5,
  },
});

const mnemonic =
  '';

const { publicKey, privateKey } = avv.generateKeyPairFromMnemonicRaw(mnemonic, 0, 0);
console.log('Publickey', publicKey);
console.log('Privatekey', privateKey);

const HomeScreen: FC<Props> = ({ navigation }) => {
  // Get state of text input
  const [txt, setTxt] = React.useState('');
  const [address, setAddress] = React.useState('');

  return (
    <View style={styles.container}>
      <Button title="Scan QR" onPress={() => navigation.navigate('ScanQR')} />
      <Button title="Generate QR" onPress={() => navigation.navigate('GenerateQR')} />

      <TextInput
        textAlignVertical="top"
        // Set state of text input
        onChangeText={(text) => {
          setTxt(text);
        }}
      />
      <Text>Index: {txt}</Text>
      <Button
              title="Enter"
              onPress={() => {
                const { publicKey, privateKey } = avv.generateKeyPairFromMnemonicRaw(mnemonic, 0, Number(txt));
                console.log('Publickey', publicKey);
                console.log('Privatekey', privateKey);

                const address = avv.generateAddressFromPublicKey(publicKey);
                setAddress(address);

                avv.getBalance(address).then((balance) => {
                  console.log(balance);
                }).catch((err) => {
                  console.log(err);
                });

                // for (let i = 0; i < 5; i++) {
                //   const address = avv.generateAddressFromXPub(txt, i);
                //   console.log('Address',i, address);
                // }
              }}
            />
      <Text>Address: {address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
});

export default HomeScreen;
