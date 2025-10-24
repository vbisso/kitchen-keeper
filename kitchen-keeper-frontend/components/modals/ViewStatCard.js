import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

const ViewStatCard = ({ counts, destination }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={() => navigation.navigate(destination)}
    >
      <View style={styles.statCardFlex}>
        {destination === "Fridge" ? (
          <>
            <Text style={styles.statLabel}>Fridge </Text>
            <Text style={styles.statNumber}>{counts.fridgeCount}</Text>
          </>
        ) : destination === "Pantry" ? (
          <>
            <Text style={styles.statLabel}>Pantry</Text>
            <Text style={styles.statNumber}>{counts.pantryCount}</Text>
          </>
        ) : null}
      </View>
      <Image
        source={require("../../assets/icons/Arrow - Right 2.png")}
        style={{
          width: 24,
          height: 24,
        }}
      ></Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    width: "100%",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  statLabel: {
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  statNumber: {
    color: "#848484",
    fontSize: RFValue(14),
  },
});

export default ViewStatCard;
