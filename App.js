import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import JSON3DViewer from './JSON3DViewer';
import InfoPanel from './InfoPanel';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <JSON3DViewer />
      <InfoPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
});
