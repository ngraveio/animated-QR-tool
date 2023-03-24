import { FC, memo } from "react";
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
  KeyboardAvoidingViewProps,
} from "react-native";

const KeyboardAvoidingView: FC<KeyboardAvoidingViewProps> = (props) => {
  return (
    <RNKeyboardAvoidingView
      keyboardVerticalOffset={70}
      behavior={"padding"}
      style={{ flex: 1 }}
      enabled={Platform.OS === "ios"}
      {...props}
    />
  );
};

export default memo(KeyboardAvoidingView);
