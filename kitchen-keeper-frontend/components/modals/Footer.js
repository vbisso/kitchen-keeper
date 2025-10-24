import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View>
        <Image
          source={require("../../assets/icons/Home.png")}
          //   style={{
          //     width: "25%",
          //     height: "25%",
          //     resizeMode: "contain",
          //   }}
        ></Image>
        <Text>Home</Text>
      </View>
      <View>
        <Image
          source={require("../../assets/icons/Plus.png")}
          //   style={{
          //     width: "35%",
          //     height: "35%",
          //     resizeMode: "contain",
          //   }}
        ></Image>
      </View>
      <View>
        <Image
          source={require("../../assets/icons/Chart.png")}
          //   style={{
          //     width: "100%",
          //     height: "100%",
          //     resizeMode: "contain",
          //   }}
        ></Image>
        <Text>Insights</Text>
      </View>
    </View>
  );
};
export default Footer;

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
