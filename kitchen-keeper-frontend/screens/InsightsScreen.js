import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useInsightsData from "../hooks/useInsightsData";
import SafeContainer from "../components/SafeContainer";

export default function InsightsScreen() {
  const { data, loading } = useInsightsData();

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <SafeContainer>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Insights</Text>

        {/* Top Metrics */}
        <View style={styles.row}>
          <View style={[styles.metricCard, { backgroundColor: "#202020" }]}>
            <Text style={styles.metricLabel}>Waste Rate</Text>
            <Text style={styles.metricValue}>{data.wasteRate}%</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: "#2B8A3E" }]}>
            <Text style={styles.metricLabel}>On-Time Use</Text>
            <Text style={styles.metricValue}>{data.onTimeRate}%</Text>
          </View>
        </View>

        {/* Most Consumed */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Most Consumed</Text>

          {data.mostConsumed.length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            data.mostConsumed.map((item, idx) => (
              <View key={idx} style={styles.listRow}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listCount}>{item.count}</Text>
              </View>
            ))
          )}
        </View>

        {/* Most Wasted */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Most Wasted</Text>

          {data.mostWasted.length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            data.mostWasted.map((item, idx) => (
              <View key={idx} style={styles.listRow}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listCount}>{item.count}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 36,
    fontFamily: "Lexend-SemiBold",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  metricCard: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  metricLabel: {
    fontSize: 18,
    color: "white",
    fontFamily: "Lexend-Regular",
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 32,
    color: "white",
    fontFamily: "Lexend-SemiBold",
  },

  sectionCard: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Lexend-SemiBold",
    marginBottom: 12,
  },

  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },

  listName: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
  },

  listCount: {
    fontSize: 16,
    fontFamily: "Lexend-SemiBold",
  },

  emptyText: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    color: "#999",
  },
});
