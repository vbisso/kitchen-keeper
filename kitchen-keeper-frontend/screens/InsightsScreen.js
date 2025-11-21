import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import useInsightsData from "../hooks/useInsightsData";

export default function InsightsScreen() {
  const { data, loading } = useInsightsData();

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }}>
        Your Insights
      </Text>

      {/* Waste Rate */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18 }}>Waste Rate</Text>
        <Text style={{ fontSize: 32, fontWeight: "700" }}>
          {data.wasteRate}%
        </Text>
      </View>

      {/* On Time */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18 }}>On-Time Consumption</Text>
        <Text style={{ fontSize: 32, fontWeight: "700" }}>
          {data.onTimeRate}%
        </Text>
      </View>

      {/* Most Consumed */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Most Consumed</Text>
        {data.mostConsumed.map((item) => (
          <Text key={item.name}>
            {item.name}: {item.count}
          </Text>
        ))}
      </View>

      {/* Most Wasted */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Most Wasted</Text>
        {data.mostWasted.map((item) => (
          <Text key={item.name}>
            {item.name}: {item.count}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
