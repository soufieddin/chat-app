import React from 'react';
import {StyleSheet, Text} from 'react-native';
import defaultStyles from "../config/styles";

function AppText({children, style, ...otherProps}) {
  return (
    <Text style={[styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}
const styles = StyleSheet.create({
  text:defaultStyles.text
})
export default AppText;