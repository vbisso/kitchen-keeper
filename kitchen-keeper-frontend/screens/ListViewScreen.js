import React, { useState, useEffect, useMemo } from "react";
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

import FoodList from "../components/food/FoodList";
import FoodModal from "../components/modals/FoodModal";
import AddOptionModal from "../components/modals/AddOptionModal";
import SearchBar from "../components/UI/SearchBar";
import { RFValue } from "react-native-responsive-fontsize";
import useFoodHandlers from "../hooks/useFoodHandlers";
import useFoodData from "../hooks/useFoodData";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import useUserData from "../hooks/useUserData";
import Header from "../components/modals/Header";
import Footer from "../components/modals/Footer";

const ListViewScreen = ({ navigation, route }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const isSelectionMode = selectedIds.length > 0;

  const handleLongPress = (id) => {
    setSelectedIds([id]); //starts selection mode
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => handleDeleteFood(id));
    setSelectedIds([]);
  };

  const [sortBy, setSortBy] = useState("expDate");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const [searchText, setSearchText] = useState("");

  const {
    foods,
    selectedFood,
    modalVisible,
    handleAddFood,
    handleEditFood,
    handleDeleteFood,
    handleSaveFood,
    handleCloseModal,
    setModalVisible,
    setSelectedFood,
    optionModalVisible,
    setOptionModalVisible,
  } = useFoodHandlers();
  const { filterFoodsByType } = useFoodData();

  const { filterType } = route.params || { filterType: "all" };
  const filteredFoods = useMemo(
    () => filterFoodsByType(foods, filterType),
    [foods, filterType]
  );
  const titles = {
    all: "All Items",
    dueToday: "Due Today",
    upcoming: "Upcoming Items",
    expired: "Expired Items",
    fridge: "Fridge Items",
    pantry: "Pantry Items",
  };

  return (
    <SafeContainer>
      {/* Header Container */}
      <Header></Header>
      {/* Solter, Filer  Container */}
      <View style={style.headlineRow}>
        <Text style={style.title}>{titles[filterType] || "Items"}</Text>

        {/* sort and filter container */}
        <View style={style.iconContainer}>
          {/* Sort icon */}
          <TouchableOpacity
            onPress={() => setShowSortOptions(!showSortOptions)}
            style={{ marginRight: 10 }}
          >
            <Image
              source={require("../assets/icons/Swap.png")}
              style={{ width: 24, height: 24 }}
            ></Image>
          </TouchableOpacity>

          {/* Filter icon */}
          <TouchableOpacity
            onPress={() => setShowFilterOptions(!showFilterOptions)}
          >
            <Image
              source={require("../assets/icons/Filter 4.png")}
              style={{ width: 24, height: 24 }}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>

      {showSortOptions && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <TouchableOpacity onPress={() => setSortBy("expDate")}>
            <Text
              style={{
                marginHorizontal: 10,
                fontWeight: sortBy === "expDate" ? "bold" : "normal",
              }}
            >
              Exp Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy("name")}>
            <Text
              style={{
                marginHorizontal: 10,
                fontWeight: sortBy === "name" ? "bold" : "normal",
              }}
            >
              Name
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showFilterOptions && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          {["All", "Fruits", "Dairy", "Meat", "Drinks"].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setFilterCategory(cat)}
              style={{ margin: 5 }}
            >
              <Text
                style={{
                  fontWeight: filterCategory === cat ? "bold" : "normal",
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SearchBar searchText={searchText} onSearch={setSearchText}></SearchBar>

      {isSelectionMode && (
        <TouchableOpacity
          style={{
            backgroundColor: "#D32F2F",
            padding: 10,
            margin: 10,
            borderRadius: 5,
          }}
          onPress={handleDeleteSelected}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Delete Selected ({selectedIds.length})
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView style={style.foodList}>
        <FoodList
          foods={filteredFoods}
          onDelete={(id) => handleDeleteFood(id)}
          onEdit={handleEditFood}
          searchText={searchText}
          onLongPress={handleLongPress}
          onToggleSelect={handleToggleSelect}
          selectedIds={selectedIds}
          isSelectionMode={isSelectionMode}
          sortBy={sortBy}
          filterCategory={filterCategory}
        />
      </ScrollView>
      {/* <View style={style.footerContainer}>
        {foods.length === 0 && (
          <View>
            <View style={style.arrowContainer}>
              <Image
                style={style.arrowImage}
                source={require("../assets/icons/arrow_icon.png")}
              ></Image>
            </View>
            <View style={style.arrowTextContainer}>
              <Text style={style.arrowText}>
                {" "}
                Click here{"\n"} to add an item
              </Text>
            </View>
          </View>
        )}

        <View style={style.footer}>
          <Pressable onPress={handleAddFood} style={style.addButton}>
            <Image
              style={style.addButtonImage}
              source={require("../assets/icons/nav_add icon.png")}
            />
          </Pressable>
        </View>
      </View> */}
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

const style = StyleSheet.create({
  title: {
    fontSize: RFValue(16),
    fontFamily: "Lexend-SemiBold",
    textAlign: "center",
  },
  headlineRow: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  // foodList: {
  //   marginTop: 5,
  //   marginBottom: 150,
  //   flex: 1,
  // },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "start",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 15,
    paddingBottom: 25,
    backgroundColor: "#FEFEFF",
  },
  ButtonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    // borderWidth: 1,
  },
  fridgeViewButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
  },
  addButton: {
    // paddingHorizontal: 5,
    position: "absolute",
    top: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  addButtonImage: {
    width: 80,
    height: 80,
  },
  pantryViewButton: {
    width: 55,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  // buttonText: {
  //   fontSize: RFValue(12),
  //   textAlign: "center",
  //   color: "#A0A0A0",
  //   marginTop: -5,
  // },
  buttonText: {
    fontSize: RFValue(12),
    textAlign: "center",
    // color: "#4A90E2", // highlight if Fridge is active
    color: "#555",
    marginTop: -7,
    // fontWeight: "500",
  },

  arrowContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginLeft: 15,
    position: "relative",
  },
  arrowImage: {
    width: 22,
    height: 22,
  },
  arrowTextContainer: {
    position: "absolute",
    top: -8,
    right: 80,
  },
  arrowText: {
    fontSize: RFValue(12),
    textAlign: "left",
    color: "#555",
  },
  // searchBarContainer: {
  //   marginTop: 10,
  //   marginHorizontal: 10,
  //   borderRadius: 10,
  //   overflow: "hidden",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  //   elevation: 2,
  // },
});

export default ListViewScreen;
