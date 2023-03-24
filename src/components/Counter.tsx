import React, { FC } from "react";
import { Button, TextInput, View } from "react-native";

interface Props {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const Counter: FC<Props> = ({ min, max, value, onChange: _onChange }) => {
  const onChange = (value: number | string) =>
    _onChange(Math.max(Math.min(Number(value) || min, max), min));

  const increment = () => {
    onChange(value + 1);
  };
  const decrement = () => {
    onChange(value - 1);
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <Button title="-" onPress={decrement} />
      </View>
      <TextInput
        value={value.toString()}
        inputMode="numeric"
        style={{ flex: 1 }}
        textAlign="center"
        onChangeText={onChange}
      />
      <View style={{ flex: 1 }}>
        <Button title="+" onPress={increment} />
      </View>
    </View>
  );
};

export default Counter;
