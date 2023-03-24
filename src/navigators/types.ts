import { StackScreenProps } from "@react-navigation/stack";

export type RootStackNavigatorParamList = {
  Home: undefined;
  ScanQR: undefined;
  GenerateQR: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackNavigatorParamList> =
  StackScreenProps<RootStackNavigatorParamList, T>;
