import React, { FC } from 'react';
import { Button, StyleSheet, View, Text, KeyboardAvoidingView, SafeAreaView, TextInput } from 'react-native';
import { RootStackScreenProps } from '../navigators/types';


import { BaseCoin, baseCrypto, ENetwork, INetwork } from '@ngrave/baseprotocol';
import { Avax, Stub as AvaxStub } from '@ngrave/avax';
// import { BinanceCoin, Stub as BinanceCoinStub } from '@ngrave/binancecoin';
import { ElrondCoin, Stub as ElrondCoinStub, TokenStub as ElrondTokenStub } from '@ngrave/elrondcoin';
import { RippleCoin, Stub as RippleCoinStub } from '@ngrave/ripple';
import { Solana, Stub as SolanaStub } from '@ngrave/solana';
import { StellarCoin, Stub as StellarCoinStub } from '@ngrave/stellar';
import { Tezos, Stub as TezosStub } from '@ngrave/tezos';
import { ZcashCoin, Stub as ZcashCoinStub } from '@ngrave/zcashcoin';
import { Ethereum, Stub as EthereumStub, TokenStub as EthereumTokenStub } from '@ngrave/ethereum';
import { BinanceSmartChain, Stub as BinanceSmartChainStub } from '@ngrave/binancesmartchain';
import { Bitcoin, Stub as BitcoinStub } from '@ngrave/bitcoin';
import { BitcoinCash, Stub as BitcoinCashStub } from '@ngrave/bitcoincash';
import { Dash, Stub as DashStub } from '@ngrave/dash';
import { DogeCoin, Stub as DogeCoinStub } from '@ngrave/dogecoin';
import { Groestlcoin, Stub as GroestlcoinStub } from '@ngrave/groestlcoin';
import { Litecoin, Stub as LitecoinStub } from '@ngrave/litecoin';
import { Polygon, Stub as PolygonStub } from '@ngrave/polygon';

type Props = RootStackScreenProps<'Home'>;

const avv = new Avax({
  network: 'testnet',
  external: {
    network: 'testnet',
    rpcUrl: 'api.avax-test.network',
    chainId: 5,
  },
});

const coins = {
  //'avax': new Avax(),
  "bitcoin": new Bitcoin(),
  // "binancecoin": new BinanceCoin(),
  "elrondcoin": new ElrondCoin(),
  // "ripple": new RippleCoin(),
  // "solana": new Solana(),
  "stellar": new StellarCoin(),
  // "tezos": new Tezos(),
  // "zcash": new ZcashCoin(),
  // "ethereum": new Ethereum(),
  // "binancesmartchain": new BinanceSmartChain(),
  //"bitcoincash": new BitcoinCash(),
  // "dash": new Dash(),
  // "dogecoin": new DogeCoin(),
  // "groestlcoin": new Groestlcoin(),
  // "litecoin": new Litecoin(),
  // "polygon": new Polygon(),
};

const mnemonic =
  'end glimpse else boring kidney coin blood course erupt defense duty arrow base leg rug lunar army episode quiz model flame rifle latin great';

const { publicKey, privateKey } = avv.generateKeyPairFromMnemonicRaw(mnemonic, 0, 0);
console.log('Publickey', publicKey);
console.log('Privatekey', privateKey);

// Generate keypair from mnemonic for all coins
for (const [coinName, protocol] of Object.entries(coins)) {
  const { publicKey, privateKey } = protocol.generateKeyPairFromMnemonicRaw(mnemonic, 0, 0);
  const address = protocol.generateAddressFromPublicKey(publicKey);
  console.log(coinName, 'Publickey', publicKey);
  console.log(coinName, 'Privatekey', privateKey);
  console.log(coinName, 'Address', address);
}

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
