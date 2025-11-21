import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Footer = ({ handleAddFood }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Image
          source={require("../../assets/icons/Home.png")}
          style={{
            resizeMode: "contain",
            width: 35,
            height: 35,
          }}
        ></Image>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={handleAddFood}>
        <Image
          source={require("../../assets/icons/Plus.png")}
          style={{
            resizeMode: "contain",
            width: 55,
            height: 55,
            marginTop: -5,
          }}
        ></Image>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Insights")}
      >
        <Image
          source={require("../../assets/icons/Chart.png")}
          style={{
            resizeMode: "contain",
            width: 35,
            height: 35,
          }}
        ></Image>
        <Text>Insights</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    position: "absolute",
    bottom: 30,
    width: "80%",
    margin: "auto",
    alignSelf: "center",
  },
  footerItem: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
});
