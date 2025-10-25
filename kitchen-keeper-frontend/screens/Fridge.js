import { View, StyleSheet, ImageBackground, ScrollView } from "react-native";
import SafeContainer from "../components/SafeContainer";

import FoodItem from "../components/food/FoodItem";
import FoodModal from "../components/modals/FoodModal";
import useFoodHandlers from "../hooks/useFoodHandlers";

const Fridge = () => {
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
  // console.log(foods);

  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };
  const foodRows = chunkArray(foods, 3);

  return (
    <SafeContainer>
      <ImageBackground
        source={require("../assets/backgrounds/fridgeBackground.png")}
        style={styles.fridgeBackground}
        resizeMode="cover"
      >
        <ScrollView style={styles.fridgeGrid}>
          {foodRows.map((row, rowIndex) => {
            const hasFridgeItem = row.some((food) => food.view === "Fridge");
            if (!hasFridgeItem) return null;

            return (
              <View key={`row-${rowIndex}`} style={styles.fridgeRow}>
                {row.map((food) =>
                  food.view === "Fridge" ? (
                    <View key={food._id} style={styles.foodItem}>
                      <FoodItem
                        value={food}
                        view={food.view}
                        onEdit={handleEditFood}
                        onDelete={() => handleDeleteFood(food._id)}
                      />
                    </View>
                  ) : null
                )}
              </View>
            );
          })}
        </ScrollView>
        <FoodModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onSave={handleSaveFood}
          onDelete={handleDeleteFood}
          selectedFood={selectedFood}
        />
      </ImageBackground>
    </SafeContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  fridgeBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  //   fridgeGrid: {
  //     position: "relative",
  //     top: "5%",
  //     left: "5%",
  //     width: "75%",
  //     height: "72%",
  //     display: "grid",
  //     gridTemplateColumns: "1fr",
  //     gridTemplateRows: "repeat(4, 1fr)",

  //     borderWidth: 1,
  //     borderColor: "black",
  //     gap: 10,
  //   },
  //   gridItem1: {
  //     display: "flex",
  //     flexDirection: "row",
  //     flexWrap: "wrap",
  //     justifyContent: "space-evenly",
  //     alignItems: "center",
  //     borderWidth: 1,
  //     borderColor: "red",
  //     maxHeight: "100%",
  //   },
  fridgeGrid: {
    position: "relative",
    top: "5%",
    left: "3.7%",
    width: "78%",
    height: "72%",
    zIndex: 10,
  },
  fridgeRow: {
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 5,
    borderColor: "#E3EEF9",
    borderRadius: 10,
    shadowColor: "#000",

    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // paddingVertical: 15,
  },

  foodItem: {
    padding: 3,
    alignItems: "center",
  },
});
export default Fridge;
