import {
  Bytes,
  CryptoCoinInfo,
  CryptoECKey,
  CryptoPSBT,
  CryptoAccount,
} from "@keystonehq/bc-ur-registry";
import { URDecoder } from "@ngraveio/bc-ur";
import {
  CryptoCoinIdentity,
  EllipticCurve,
} from "@ngraveio/bc-ur-registry-crypto-coin-identity";
import { HexString } from "@ngraveio/bc-ur-registry-hex-string";
import {
  CryptoDetailedAccount,
  CryptoPortfolioCoin,
  CryptoPortfolioMetadata,
  CryptoOutput,
  ScriptExpressions,
  CryptoPortfolio,
  CryptoHDKey,
  CryptoKeypath,
  PathComponent,
  RegistryItem,
} from "@ngraveio/bc-ur-multi-layer-sync";

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
      case "hex-string":
        return HexString.fromCBOR(ur.cbor);
      case "crypto-detailed-account":
        return CryptoDetailedAccount.fromCBOR(ur.cbor);
      case "crypto-portfolio-coin":
        return CryptoPortfolioCoin.fromCBOR(ur.cbor);
      case "crypto-portfolio-metadata":
        return CryptoPortfolioMetadata.fromCBOR(ur.cbor);
      case "crypto-portfolio":
        return CryptoPortfolio.fromCBOR(ur.cbor);
      default:
        throw new Error(
          `#[ur-registry][Decoder][fn.resultRegistryType]: registry type ${ur.type} is not supported now`
        );
    }
  };
}

export function createCryptoCoinIdentity(): RegistryItem {
  const curve = 8; // EllipticCurve.secp256k1
  const type = 60;
  const chainId = "137";
  const subTypes = [chainId];

  const coinIdentity = new CryptoCoinIdentity(curve, type, subTypes);

  // console.log('coinIdentity', coinIdentity.toUrl())
  return coinIdentity;
  // console.log(coinIdentity.toCBOR().toString('hex'));
  // "a3010802183c038163313337"
  // const ur = coinIdentity.toUREncoder().nextPart();
  // console.log(ur);
  // :ur:crypto-coin-identity/otadayaocsfnaxlyiaeheoemaojsbajy"
}

export function createCryptoDetailedAccount(): RegistryItem {
  // Create a path component
  const originKeyPath = new CryptoKeypath([
    new PathComponent({ index: 44, hardened: true }),
    new PathComponent({ index: 501, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
  ]);

  // Create a HDKey
  const cryptoHDKey = new CryptoHDKey({
    isMaster: false,
    key: Buffer.from(
      "02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b",
      "hex"
    ),
    origin: originKeyPath,
  });

  // Create detailed account
  const detailedAccount = new CryptoDetailedAccount(cryptoHDKey);

  return detailedAccount;

  // const cbor = detailedAccount.toCBOR().toString('hex')
  // const ur = detailedAccount.toUREncoder(1000).nextPart()
  // console.log(cbor)
  //'a101d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5'
  // console.log(ur)
  // 'ur:crypto-detailed-account/oyadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeyknegrrfkn'
}

export function createCryptoPortfolioCoin(): RegistryItem {
  // Create a coin identity
  const coinIdentity = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);

  const cryptoHDKey = new CryptoHDKey({
    isMaster: false,
    key: Buffer.from(
      "02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0",
      "hex"
    ),
    origin: new CryptoKeypath([
      new PathComponent({ index: 60, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: false }),
      new PathComponent({ index: 0, hardened: false }),
    ]),
    parentFingerprint: Buffer.from("78412e3a", "hex"),
  });

  const tokenIds = [
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  ];

  // add a cryptoHD key from a known hex
  const cryptoHDKey2 = CryptoHDKey.fromCBOR(
    Buffer.from(
      "a203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f5",
      "hex"
    )
  );

  const tokenIds2 = ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"];

  // Create a detailed account
  const detailedAccount = new CryptoDetailedAccount(cryptoHDKey, tokenIds);
  const detailedAccount2 = new CryptoDetailedAccount(cryptoHDKey2, tokenIds2);

  // Create a CryptoPortfolioCoin
  const cryptoPortfolioCoin = new CryptoPortfolioCoin(coinIdentity,[]);
  // const cryptoPortfolioCoin = new CryptoPortfolioCoin(coinIdentity, [
  //   detailedAccount,
  //   detailedAccount2,
  // ]);
  return cryptoPortfolioCoin;
  // const cbor = cryptoPortfolioCoin.toCBOR().toString('hex')
  // console.log(cbor)
  // a201d90579a3010802183c03f70282d9057aa201d9012fa303582102d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f006d90130a1018a183cf500f500f500f400f4081a78412e3a0282d9010754dac17f958d2ee523a2206206994597c13d831ec7d9010754b8c77482e45f1f44de1745f52c74426c631bdd52d9057aa201d9012fa203582102eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b06d90130a10188182cf51901f5f500f500f50281782c45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a77795444743176
  // const ur = cryptoPortfolioCoin.toUREncoder(1000).nextPart()
  // console.log(ur)
  // ur:crypto-portfolio-coin/oeadtaahkkotadayaocsfnaxylaolftaahknoeadtaaddlotaxhdclaotdqdinaeesjzmolfzsbbidlpiyhddlcximhltirfsptlvsmohscsamsgzoaxadwtamtaaddyoyadlecsfnykaeykaeykaewkaewkaycyksfpdmftaolftaadatghtnselbmdlgdmvwcnoecxidamnlfemssefslscksttaadatghrostjylfvehectfyuechfeykdwjyfwjziacwutgmtaahknoeadtaaddloeaxhdclaowdverokopdinhseeroisyalksaykctjshedprnuyjyfgrovawewftyghceglrpkgamtaaddyoyadlocsdwykcfadykykaeykaeykaolyksdwfegdimfghgi
}

export function createCryptoPortfolioMetadata(): RegistryItem {
  // Create sync id
  const sync_id = Buffer.from("babe0000babe00112233445566778899", "hex");

  // Create metadata
  const metadata = new CryptoPortfolioMetadata({
    sync_id: sync_id,
    device: "my-device",
    language_code: "en",
    fw_version: "1.0.0",
  });

  return metadata;
  // const cbor = metadata.toCBOR().toString('hex')
  // console.log(cbor)
  // a40150babe0000babe001122334455667788990262656e0365312e302e3004696d792d646576696365
  // const ur = metadata.toUREncoder(1000).nextPart()
  // console.log(ur)
  // ur:crypto-portfolio-metadata/oxadgdrdrnaeaerdrnaebycpeofygoiyktlonlaoidihjtaxihehdmdydmdyaainjnkkdpieihkoiniaihfrzmytvl
}

export function createCryptoPortfolio(): RegistryItem {
  // Create the coin identities of the 4 desired coins.
  const coinIdEth = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60);
  const coinIdSol = new CryptoCoinIdentity(EllipticCurve.secp256k1, 501);
  const coinIdMatic = new CryptoCoinIdentity(EllipticCurve.secp256k1, 60, [
    137,
  ]);
  const coinIdBtc = new CryptoCoinIdentity(EllipticCurve.secp256k1, 0);

  /**
   * Create the accounts that will be included in the coins.
   * */
  // Ethereum with USDC ERC20 token
  const accountEth = new CryptoDetailedAccount(
    new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        "032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4",
        "hex"
      ),
      chainCode: Buffer.from(
        "D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0",
        "hex"
      ),
      origin: new CryptoKeypath([
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 60, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ]),
      children: new CryptoKeypath([
        new PathComponent({ index: 0, hardened: false }),
        new PathComponent({ index: 1, hardened: false }),
      ]),
    }),
    ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"] // USDC ERC20 token on Ethereum
  );

  // Polygon with USDC ERC20 token
  const accountMatic = new CryptoDetailedAccount(
    new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        "032503D7DCA4FF0594F0404D56188542A18D8E0784443134C716178BC1819C3DD4",
        "hex"
      ),
      chainCode: Buffer.from(
        "D2B36900396C9282FA14628566582F206A5DD0BCC8D5E892611806CAFB0301F0",
        "hex"
      ),
      origin: new CryptoKeypath([
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 60, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ]),
      children: new CryptoKeypath([
        new PathComponent({ index: 0, hardened: false }),
        new PathComponent({ index: 1, hardened: false }),
      ]),
    }),
    ["2791Bca1f2de4661ED88A30C99A7a9449Aa84174"] // USDC ERC20 token on Polygon
  );

  // Solana with USDC SPL token
  const accountSol = new CryptoDetailedAccount(
    new CryptoHDKey({
      isMaster: false,
      key: Buffer.from(
        "02EAE4B876A8696134B868F88CC2F51F715F2DBEDB7446B8E6EDF3D4541C4EB67B",
        "hex"
      ),
      origin: new CryptoKeypath([
        new PathComponent({ index: 44, hardened: true }),
        new PathComponent({ index: 501, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
        new PathComponent({ index: 0, hardened: true }),
      ]),
    }),
    ["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"] // USDC SPL token
  );

  // Account with crypto-output public key hash
  const accountBtc = new CryptoDetailedAccount(
    new CryptoOutput(
      [ScriptExpressions.PUBLIC_KEY_HASH],
      new CryptoHDKey({
        isMaster: false,
        key: Buffer.from(
          "03EB3E2863911826374DE86C231A4B76F0B89DFA174AFB78D7F478199884D9DD32",
          "hex"
        ),
        chainCode: Buffer.from(
          "6456A5DF2DB0F6D9AF72B2A1AF4B25F45200ED6FCC29C3440B311D4796B70B5B",
          "hex"
        ),
        origin: new CryptoKeypath([
          new PathComponent({ index: 44, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
          new PathComponent({ index: 0, hardened: true }),
        ]),
        children: new CryptoKeypath([
          new PathComponent({ index: 0, hardened: false }),
          new PathComponent({ index: 0, hardened: false }),
        ]),
      })
    )
  );

  // Create the coins
  const cryptoCoinEth = new CryptoPortfolioCoin(coinIdEth, [accountEth]);
  const cryptoCoinSol = new CryptoPortfolioCoin(coinIdSol, [accountSol]);
  const cryptoCoinMatic = new CryptoPortfolioCoin(coinIdMatic, [accountMatic]);
  const cryptoCoinBtc = new CryptoPortfolioCoin(coinIdBtc, [accountBtc]);

  // Create the metadata.
  const metadata = new CryptoPortfolioMetadata({
    sync_id: Buffer.from("123456781234567802D9044FA3011A71", "hex"),
    language_code: "en",
    fw_version: "1.2.1-1.rc",
    device: "NGRAVE ZERO",
  });

  // Create the Crypto Portfolio
  const cryptoPortfolio = new CryptoPortfolio(
    [cryptoCoinEth, cryptoCoinSol, cryptoCoinMatic, cryptoCoinBtc],
    metadata
  );
  return cryptoPortfolio;
}
