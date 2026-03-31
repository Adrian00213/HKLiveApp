import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockIncidents } from '../services/mockData';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const initialRegion = '22.3193,114.1694'; // Hong Kong
  
  const googleMapsUrl = `https://www.google.com/maps?q=${initialRegion}&z=14&output=embed`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HKLive</Text>
        <Text style={styles.headerSubtitle}>🗺️ 香港</Text>
      </View>
      <View style={styles.mapContainer}>
        <WebView
          style={styles.webview}
          source={{ uri: googleMapsUrl }}
          allowsFullScreenVideo={false}
          allowsInlineMediaPlayback={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>🗺️ 地圖加載中...</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.incidentList}>
        <Text style={styles.listTitle}>📍 附近事件 ({mockIncidents.length}個)</Text>
        {mockIncidents.map((incident) => (
          <View key={incident.id} style={styles.incidentCard}>
            <Text style={styles.incidentIcon}>
              {incident.type === 'accident' ? '🚨' : 
               incident.type === 'event' ? '🎉' : 
               incident.type === 'weather' ? '⛈️' : 
               incident.type === 'traffic' ? '🚗' : '📍'}
            </Text>
            <View style={styles.incidentInfo}>
              <Text style={styles.incidentTitle} numberOfLines={1}>{incident.title}</Text>
              <Text style={styles.incidentDesc} numberOfLines={1}>{incident.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  mapContainer: { height: height * 0.4, backgroundColor: '#E8F4F8' },
  webview: { flex: 1 },
  loadingContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F4F8' },
  loadingText: { fontSize: 16, color: '#666' },
  incidentList: { flex: 1, padding: 16 },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  incidentCard: { flexDirection: 'row', backgroundColor: '#F8F8F8', padding: 12, borderRadius: 10, marginBottom: 8, alignItems: 'center' },
  incidentIcon: { fontSize: 24, marginRight: 10 },
  incidentInfo: { flex: 1 },
  incidentTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 2 },
  incidentDesc: { fontSize: 12, color: '#666' },
});

export default MapScreen;
