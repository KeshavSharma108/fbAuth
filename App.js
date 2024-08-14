import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import "expo-dev-client";
import { firebase } from "./config";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

export default function App() {
  const [initialize, setInitializing] = useState(true);
  const [user, setUser] = useState();

  //handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initialize) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const signInWithFB = async () => {
    try {
      await LoginManager.logInWithPermissions(["public_profile", "email"]);
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        return;
      }
      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken
      );
      const auth = getAuth();
      const response = await signInWithCredential(auth, facebookCredential);
      console.log("response", response);
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.log(e);
    }
    
  };



  if (initialize) return null;
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30, margin: 20 }}>Sign With Facebook</Text>
        <Button title="Sign in with Facebook" onPress={signInWithFB} />
        <StatusBar style="auto" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, margin: 20 }}>
        WelCome! {user.displayName}
      </Text>
      <Image
        source={{ uri: user.photoURL }}
        style={{ width: 180, height: 180, borderRadius: 90 }}
      />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
