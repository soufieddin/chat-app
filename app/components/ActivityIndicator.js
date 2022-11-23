import React, {useRef, useEffect}  from 'react'
import { StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native'

export default function ActivityIndicator({ visible = false, size= 150 }) {
  if (!visible) return null;
  const animation = useRef();

  useEffect(()=>{
    animation.current.play();
  },[])
  return (
    <View style={styles.overlay}>
      <LottieView 
        style={{ width:size, height:size }} 
        autoPlay={true}
        ref={animation}
        source={require('../assets/animations/loading.json')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay:{
    flex:1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent:"center",
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
    opacity: 0.8,
    elevation:5,
  }
})
