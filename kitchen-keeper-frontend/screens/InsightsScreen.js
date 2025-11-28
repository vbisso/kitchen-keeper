import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
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
        <Text style={styles.header}>Insights</Text>

        {/* TOP METRICS */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Waste Rate</Text>
            <Text style={styles.metricValue}>{data.wasteRate}%</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>On-Time Use</Text>
            <Text style={styles.metricValue}>{data.onTimeRate}%</Text>
          </View>
        </View>

        {/* LIST SECTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Consumed</Text>
          {data.mostConsumed.length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            data.mostConsumed.map((item) => (
              <View key={item.name} style={styles.listItem}>
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemCount}>{item.count}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Wasted</Text>
          {data.mostWasted.length === 0 ? (
            <Text style={styles.emptyText}>No data available</Text>
          ) : (
            data.mostWasted.map((item) => (
              <View key={item.name} style={styles.listItem}>
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemCount}>{item.count}</Text>
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
    padding: 18,
    backgroundColor: "#F8FAFC",
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    color: "#1E293B",
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  metricCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    marginRight: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  metricLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 5,
  },

  metricValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
  },

  section: {
    marginBottom: 25,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1E293B",
  },

  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 10,
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },

  listItemName: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "500",
  },

  listItemCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
});
