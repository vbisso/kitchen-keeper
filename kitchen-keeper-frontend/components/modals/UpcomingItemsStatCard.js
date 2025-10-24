import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
const UpcomingItemsStatCard = ({ counts }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={() => navigation.navigate("AllItems")}
    >
      <View style={styles.statCardFlex}>
        <Image
          source={require("../../assets/icons/Notification.png")}
          style={{
            width: 45,
            height: 45,
          }}
        ></Image>
        <Text style={styles.statNumber}>{counts.dueToday}</Text>
      </View>
      <View style={styles.statCardFlex}>
        <Text style={styles.statLabel}>Upcoming</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#3C3A42",
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
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingLeft: 5,
  },
});

export default UpcomingItemsStatCard;
