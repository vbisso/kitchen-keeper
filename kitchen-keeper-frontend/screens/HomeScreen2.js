import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import useFoodData from "../hooks/useFoodData";
import FoodModal from "../components/modals/FoodModal";
import AddOptionModal from "../components/modals/AddOptionModal";
import { RFValue } from "react-native-responsive-fontsize";
import AllItemsStatCard from "../components/modals/AllItemsStatCard";
import DueTodayItemsStatCard from "../components/modals/DueTodayItemsStatCard";
import UpcomingItemsStatCard from "../components/modals/UpcomingItemsStatCard";
import ExpiredItemsStatCard from "../components/modals/ExpiredItemsStatCard";
import ViewStatCard from "../components/modals/ViewStatCard";

import { useFocusEffect } from "@react-navigation/native";
import useUserData from "../hooks/useUserData";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
const HomeScreen2 = () => {
  const { counts, loadFoods } = useFoodData();
  const { data: user } = useUserData();
  const navigation = useNavigation();
  //   console.log("user:", user.firstName);

  const formattedDate = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    })
    .replace(/(\w+), (\w+) (\d+)/, "$1, $3 $2");

  useFocusEffect(
    React.useCallback(() => {
      loadFoods(); // reload data every time the screen comes into focus
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
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
            source={require("../assets/icons/Setting.png")}
          ></Image>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <AllItemsStatCard counts={counts} />
        <DueTodayItemsStatCard counts={counts} />
        <UpcomingItemsStatCard counts={counts} />
        <ExpiredItemsStatCard counts={counts} />
      </View>

      {/* Views Grid */}
      <View style={styles.viewsGrid}>
        <ViewStatCard counts={counts} destination={"Fridge"} />
        <ViewStatCard counts={counts} destination={"Pantry"} />
      </View>
    </ScrollView>
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
    fontWeight: "bold",
  },
  date: {
    color: "#838A8F",
    fontSize: RFValue(12),
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  viewsGrid: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
export default HomeScreen2;
