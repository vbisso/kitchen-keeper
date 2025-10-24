import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ExpiredItemsStatCard = ({ counts }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={() => navigation.navigate("AllItems")}
    >
      <View style={styles.statCardFlex}>
        <Image
          source={require("../../assets/icons/Danger Triangle.png")}
          style={{
            width: 45,
            height: 45,
          }}
        ></Image>
        <Text style={styles.statNumber}>{counts.dueToday}</Text>
      </View>
      <View style={styles.statCardFlex}>
        <Text style={styles.statLabel}>Expired</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#BF58BB",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
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
    width: "100%",
    marginBottom: 10,
  },

  statNumber: {
    fontSize: 36,
    marginBottom: 8,
    color: "#FFFFFF",
    fontFamily: "Lexend-SemiBold",
  },
  statLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingLeft: 5,
    fontFamily: "Lexend-SemiBold",
  },
});

export default ExpiredItemsStatCard;
