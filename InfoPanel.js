import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InfoPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3D JSON Viewer</Text>
      
      <View style={styles.legend}>
        <LegendItem color="#9b59b6" label="Object" />
        <LegendItem color="#e74c3c" label="Array (Stacks Y)" />
        <LegendItem color="#2ecc71" label="String" />
        <LegendItem color="#3498db" label="Number" />
        <LegendItem color="#e67e22" label="Boolean" />
      </View>
      
      <Text style={styles.instructions}>
        Touch/Drag to Orbit • Pinch to Zoom
      </Text>
    </View>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legend: {
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
  },
  instructions: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontStyle: 'italic',
  },
});
