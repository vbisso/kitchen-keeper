import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import React, { useState, useEffect } from "react";
import useUserData from "../../hooks/useUserData";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

const Header = () => {
  const { data: user } = useUserData();
  const navigation = useNavigation();
  const formattedDate = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    })
    .replace(/(\w+), (\w+) (\d+)/, "$1, $3 $2");

  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.name}>Welcome, {user?.firstName || ""}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <Image
          style={{
            width: 30,
            height: 30,
          }}
          source={require("../../assets/icons/Setting.png")}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: "column",

    alignItems: "flex-start",
  },
  name: {
    fontSize: RFValue(20),
    fontFamily: "Lexend-SemiBold",
  },
  date: {
    color: "#838A8F",
    fontSize: RFValue(12),
    fontFamily: "Lexend-Regular",
  },
});

export default Header;
