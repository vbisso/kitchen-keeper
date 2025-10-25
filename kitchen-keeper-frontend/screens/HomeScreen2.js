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
import SafeContainer from "../components/SafeContainer";
import useFoodData from "../hooks/useFoodData";
import useFoodHandlers from "../hooks/useFoodHandlers";
import FoodModal from "../components/modals/FoodModal";
import AddOptionModal from "../components/modals/AddOptionModal";
import { RFValue } from "react-native-responsive-fontsize";
import AllItemsStatCard from "../components/modals/AllItemsStatCard";
import DueTodayItemsStatCard from "../components/modals/DueTodayItemsStatCard";
import UpcomingItemsStatCard from "../components/modals/UpcomingItemsStatCard";
import ExpiredItemsStatCard from "../components/modals/ExpiredItemsStatCard";
import ViewStatCard from "../components/modals/ViewStatCard";
import Footer from "../components/modals/Footer";
import { useFocusEffect } from "@react-navigation/native";
import useUserData from "../hooks/useUserData";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/modals/Header";
const HomeScreen2 = () => {
  const { counts, loadFoods } = useFoodData("expDate");
  const navigation = useNavigation();
  const {
    foods,
    selectedFood,
    modalVisible,
    handleAddFood,
    handleDeleteFood,
    handleSaveFood,
    handleCloseModal,
    setModalVisible,
    optionModalVisible,
    setOptionModalVisible,
  } = useFoodHandlers(loadFoods);

  useFocusEffect(
    React.useCallback(() => {
      loadFoods(); // reload data every time the screen comes into focus
    }, [])
  );
  return (
    <SafeContainer>
      <ScrollView>
        {/* Header */}
        <Header></Header>

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

      {/* Footer */}

      <Footer handleAddFood={handleAddFood}></Footer>
      <AddOptionModal
        visible={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        onTakePhoto={() => {
          navigation.navigate("Take Photo"), setOptionModalVisible(false);
        }}
        onManualEntry={() => {
          setModalVisible(true);
          setOptionModalVisible(false);
        }}
        onScanBarcode={() => {
          navigation.navigate("Scan"), setOptionModalVisible(false);
        }}
      ></AddOptionModal>
      <FoodModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveFood}
        onDelete={handleDeleteFood}
        selectedFood={selectedFood}
      />
    </SafeContainer>
  );
};
const styles = StyleSheet.create({
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
