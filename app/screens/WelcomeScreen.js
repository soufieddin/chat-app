import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Button from '../components/Button';
import colors from '../config/colors';
import routes from "../navigation/routes";

function WelcomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image style={styles.logo} source={require('../assets/lightIcon.png')}/>
      </View>
      <View style={styles.btnContainer}>
        <Button styleBtn={styles.btn} text="login" styleText={styles.text} onPress={() => navigation.navigate(routes.LOGIN)}/>
        <Button styleBtn={styles.btn2} text="register" color="white" styleText={styles.tex}onPress={() => navigation.navigate(routes.REGISTER)}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"flex-end",
    alignItems: 'center',
    backgroundColor:"#ffffff",
    width: "100%",
  },
  title: {
    color:"#000040",
    fontSize:20
  },
  text:{
    color:colors.white,
    fontSize:18,
    textTransform:"uppercase",
  },
  tex:{
    color: colors.primary,
    fontSize:18,
    textTransform:"uppercase",
  },
  btnContainer:{
    padding:20,
    width: "100%",
  },
  btn: {
    width: '100%',
    height: 60,
    backgroundColor:colors.primary,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    padding: 15,
    marginVertical:10,
    borderWidth:2,
  },
  btn2:{
    width: '100%',
    height: 60,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    padding: 15,
    marginVertical:10,
    borderWidth:2,
  },
  logo:{
    width: 200,
    height:200,
  },
  logoWrapper:{
    position: "absolute",
    top: 200,
    alignItems: "center",
  }
})
export default WelcomeScreen;