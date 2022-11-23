import React from 'react'
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native'

export default function Screen({children, style}) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.wrapper]}>
        {children}
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight+10 : 10,
  }
})
