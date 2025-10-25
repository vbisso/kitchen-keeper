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
      <View style={styles.footerItem}>
        <Image
          source={require("../../assets/icons/Chart.png")}
          style={{
            resizeMode: "contain",
            width: 35,
            height: 35,
          }}
        ></Image>
        <Text>Insights</Text>
      </View>
    </View>
  );
};
export default Footer;

const styles = StyleSheet.create({
  footer: {
    width: "80%",
    // height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "red",
    margin: "auto",
    paddingBottom: 10,
  },
  footerItem: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
});
