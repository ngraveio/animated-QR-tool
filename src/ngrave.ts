import { Bytes, CryptoHDKey, CryptoKeypath, CryptoCoinInfo, CryptoECKey, CryptoOutput, CryptoPSBT, CryptoAccount, RegistryItem } from "@keystonehq/bc-ur-registry";
import { URDecoder } from "@ngraveio/bc-ur";
import {CryptoCoinIdentity} from "@ngrave/bc-ur-registry-crypto-coin-identity";

export class URRegistryDecoder extends URDecoder {
    public resultRegistryType = () => {
      const ur = this.resultUR();
      switch (ur.type) {
        case "bytes":
          return Bytes.fromCBOR(ur.cbor);
        case "crypto-hdkey":
          return CryptoHDKey.fromCBOR(ur.cbor);
        case "crypto-keypath":
          return CryptoKeypath.fromCBOR(ur.cbor);
        case "crypto-coin-info":
          return CryptoCoinInfo.fromCBOR(ur.cbor);
        case "crypto-eckey":
          return CryptoECKey.fromCBOR(ur.cbor);
        case "crypto-output":
          return CryptoOutput.fromCBOR(ur.cbor);
        case "crypto-psbt":
          return CryptoPSBT.fromCBOR(ur.cbor);
        case "crypto-account":
          return CryptoAccount.fromCBOR(ur.cbor);
          case "crypto-coin-identity":
            return CryptoCoinIdentity.fromCBOR(ur.cbor);
        // case "eth-signature":
        //   return ETHSignature.fromCBOR(ur.cbor);
        // case "eth-sign-request":
        //   return EthSignRequest.fromCBOR(ur.cbor);
        default:
          throw new Error(
            `#[ur-registry][Decoder][fn.resultRegistryType]: registry type ${ur.type} is not supported now`
          );
      }
    };
  }
  

  export function createCryptoCoinIdentity() : RegistryItem {
    const curve =  8// EllipticCurve.secp256k1
    const type = 60
    const chainId = '137'
    const subTypes = [chainId]
    
    const coinIdentity = new CryptoCoinIdentity(curve, type, subTypes)
    
    // console.log('coinIdentity', coinIdentity.toUrl())
    return coinIdentity as unknown as RegistryItem;
    // console.log(coinIdentity.toCBOR().toString('hex'));
    // "a3010802183c038163313337"
    // const ur = coinIdentity.toUREncoder().nextPart();
    // console.log(ur);
    // :ur:crypto-coin-identity/otadayaocsfnaxlyiaeheoemaojsbajy"
  }