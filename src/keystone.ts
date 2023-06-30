import {
  CryptoOutput,
  CryptoECKey,
  ScriptExpressions,
  RegistryItem,
  CryptoHDKey,
  CryptoKeypath,
  PathComponent,
  CryptoMultiAccounts,
  CryptoAccount,
} from "@keystonehq/bc-ur-registry";

export function createCryptoOutput(
  key = "02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5"
): RegistryItem {
  const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
  const ecKey = new CryptoECKey({
    data: Buffer.from(key, "hex"),
    curve: 1,
  });

  const cryptoOutput = new CryptoOutput(scriptExpressions, ecKey);
  return cryptoOutput;
}

export function createCryptoHdKey(): RegistryItem {
  const originKeypath = new CryptoKeypath(
    [
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ],
    Buffer.from("d34db33f", "hex")
  );
  const childrenKeypath = new CryptoKeypath([
    new PathComponent({ index: 1, hardened: false }),
    new PathComponent({ hardened: false }),
  ]);
  const hdkey = new CryptoHDKey({
    isMaster: false,
    key: Buffer.from(
      "02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0",
      "hex"
    ),
    chainCode: Buffer.from(
      "637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29",
      "hex"
    ),
    origin: originKeypath,
    children: childrenKeypath,
    parentFingerprint: Buffer.from("78412e3a", "hex"),
  });
  return hdkey;
}

export function createCryptoAccount(): RegistryItem {
  const masterFingerprint = Buffer.from("37b5eed4", "hex");
  const parentFingerprint = Buffer.from("37b5eed4", "hex");
  const key = Buffer.from(
    "0260563ee80c26844621b06b74070baf0e23fb76ce439d0237e87502ebbd3ca346",
    "hex"
  );
  const chainCode = Buffer.from(
    "2fa0e41c9dc43dc4518659bfcef935ba8101b57dbc0812805dd983bc1d34b813",
    "hex"
  );

  const cryptoAccount = new CryptoAccount(Buffer.from("37b5eed4", "hex"), [
    new CryptoOutput(
      [ScriptExpressions.WITNESS_SCRIPT_HASH],
      new CryptoHDKey({
        isMaster: false,
        key,
        chainCode: chainCode,
        origin: new CryptoKeypath(
          [
            new PathComponent({ index: 48, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),
            new PathComponent({ index: 2, hardened: true }),
          ],
          masterFingerprint
        ),
        parentFingerprint,
      })
    ),
  ]);
  return cryptoAccount;
}
export function createCryptoMultiAccount(): RegistryItem {
  const originKeyPath = new CryptoKeypath([
    new PathComponent({ index: 44, hardened: true }),
    new PathComponent({ index: 501, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
  ]);

  const cryptoHDKey = new CryptoHDKey({
    isMaster: false,
    key: Buffer.from(
      "02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b",
      "hex"
    ),
    origin: originKeyPath,
  });

  const multiAccounts = new CryptoMultiAccounts(
    Buffer.from("e9181cf3", "hex"),
    [cryptoHDKey],
    "keystone"
  );
  return multiAccounts;
}
