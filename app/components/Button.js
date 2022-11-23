import React from 'react';
import {Text, TouchableOpacity} from "react-native";

import colors from "../config/colors";

function Button({styleBtn, text, styleText, onPress, color="primary"}) {
  return (
    <TouchableOpacity style={[styleBtn, {backgroundColor:colors[color]}]} onPress={onPress} color={color}>
      <Text style={styleText}>{text}</Text>
    </TouchableOpacity>

  );
}
export default Button;