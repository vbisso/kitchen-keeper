import React from "react";
import { TextInput, StyleSheet, View, Image } from "react-native";
import { RadialGradient } from "react-native-gradients";
import { RFValue } from "react-native-responsive-fontsize";

const SearchBar = ({ searchText, onSearch }) => {
  const colorList = [
    { offset: "0%", color: "#FFFFFF", opacity: "1" },
    { offset: "60%", color: "#F5F5F5", opacity: "1" },
    { offset: "100%", color: "#E8E8E8", opacity: "1" },
  ];
  return (
    <View style={styles.wrapper}>
      {/* Search bar content */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/icons/Search.png")}
          style={styles.searchImage}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#838A8F"
          value={searchText}
          onChangeText={onSearch}
        />
      </View>
      {/* Gradient background */}
      <View style={styles.gradientContainer}>
        <RadialGradient
          x="50%"
          y="50%"
          rx="50%"
          ry="50%"
          colorList={colorList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
    position: "relative",
  },
  gradientContainer: {
    position: "absolute",
    width: "100%",
    height: 45,
    borderRadius: 50,
    overflow: "hidden",
    shadowColor: "#838A8F",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderRadius: 50,
    paddingHorizontal: 15,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  input: {
    flex: 1,

    marginLeft: 10,
    fontSize: RFValue(12),
  },
  searchImage: {
    width: 22,
    height: 22,
    marginRight: 5,
  },
});

export default SearchBar;
