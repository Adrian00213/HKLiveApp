import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../i18n/useTranslation';
import { mockIncidents } from '../services/mockData';
import { Incident, IncidentType } from '../types';

const incidentColors: Record<IncidentType, string> = {
  accident: '#F44336',
  event: '#FF9800',
  weather: '#2196F3',
  traffic: '#FF5722',
  other: '#9E9E9E',
};

const incidentIcons: Record<IncidentType, string> = {
  accident: '🚨',
  event: '🎉',
  weather: '⛈️',
  traffic: '🚗',
  other: '📍',
};

const IncidentIcon = ({ type, size = 22 }: { type: IncidentType; size?: number }) => (
  <Text style={{ fontSize: size }}>{incidentIcons[type]}</Text>
);

const MapScreen: React.FC = () => {
  const { t } = useTranslation();
  const { incidents, setIncidents } = useAppStore();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filter, setFilter] = useState<IncidentType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<IncidentType>('accident');
  const [reportDescription, setReportDescription] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 22.3193,
    longitude: 114.1694,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('權限不足', '需要位置權限才能使用地圖功能');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setUserLocation({ lat: latitude, lng: longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Sort incidents by distance from user
      const sorted = [...mockIncidents].sort((a, b) => {
        const distA = getDistance(latitude, longitude, a.lat, a.lng);
        const distB = getDistance(latitude, longitude, b.lat, b.lng);
        return distA - distB;
      });
      setIncidents(sorted);
      setIsLoading(false);
    } catch (error) {
      console.error('Location error:', error);
      setIsLoading(false);
    }
  };

  // Haversine distance calculation
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedIncidents = [...incidents].sort((a, b) => 
    (a.distance || 999) - (b.distance || 999)
  );

  const filteredIncidents = filter === 'all'
    ? sortedIncidents
    : sortedIncidents.filter(i => i.type === filter);

  const incidentTypes: Array<{ key: IncidentType | 'all'; label: string }> = [
    { key: 'all', label: '全部' },
    { key: 'accident', label: '意外' },
    { key: 'traffic', label: '塞車' },
    { key: 'event', label: '活動' },
    { key: 'weather', label: '天氣' },
  ];

  const handleUpvote = (id: string) => {
    setIncidents(incidents.map(i => 
      i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i
    ));
    if (selectedIncident?.id === id) {
      setSelectedIncident({ ...selectedIncident, upvotes: selectedIncident.upvotes + 1 });
    }
  };

  const formatDistance = (km?: number) => {
    if (!km || km < 0.1) return '<100m';
    if (km < 1) return `${(km * 1000).toFixed(0)}m`;
    return `${km.toFixed(1)}km`;
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return '就啱';
    if (mins < 60) return `${mins}分鐘前`;
    if (hours < 24) return `${hours}個幾鐘前`;
    return '尋日';
  };

  const onRegionChangeComplete = (region: Region) => {
    setMapRegion(region);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>緊認位置...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HKLive</Text>
          <Text style={styles.headerSubtitle}>
            🗺️ {filteredIncidents.length}個附近事件 · 由近到遠
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.locationBtn}
          onPress={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: userLocation.lat,
                longitude: userLocation.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }, 500);
            }
          }}
        >
          <Text style={styles.locationBtnIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {incidentTypes.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterTab, filter === key && styles.filterTabActive]}
              onPress={() => setFilter(key)}
            >
              {key !== 'all' && (
                <Text style={styles.filterIcon}>{incidentIcons[key as IncidentType]}</Text>
              )}
              <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Real Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={mapRegion}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
              title="你既位置"
              pinColor="#FF6B35"
            />
          )}

          {/* Incident markers */}
          {filteredIncidents.map((incident) => (
            <Marker
              key={incident.id}
              coordinate={{ latitude: incident.lat, longitude: incident.lng }}
              title={incident.title}
              description={incident.description}
              onPress={() => setSelectedIncident(incident)}
            >
              <View style={[styles.markerContainer, { borderColor: incidentColors[incident.type] }]}>
                <IncidentIcon type={incident.type} size={18} />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.mapControlBtn}
            onPress={() => {
              const newDelta = Math.max(0.01, mapRegion.latitudeDelta * 0.5);
              setMapRegion({ ...mapRegion, latitudeDelta: newDelta, longitudeDelta: newDelta });
            }}
          >
            <Text style={styles.mapControlIcon}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mapControlBtn}
            onPress={() => {
              const newDelta = Math.min(1, mapRegion.latitudeDelta * 2);
              setMapRegion({ ...mapRegion, latitudeDelta: newDelta, longitudeDelta: newDelta });
            }}
          >
            <Text style={styles.mapControlIcon}>➖</Text>
          </TouchableOpacity>
        </View>

        {/* Layers button */}
        <TouchableOpacity style={styles.layersBtn}>
          <Text style={styles.layersIcon}>📑</Text>
          <Text style={styles.layersText}>圖層</Text>
        </TouchableOpacity>
      </View>

      {/* Selected incident detail */}
      {selectedIncident && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailIconBox, { backgroundColor: incidentColors[selectedIncident.type] + '20' }]}>
              <IncidentIcon type={selectedIncident.type} size={26} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailTitle}>{selectedIncident.title}</Text>
              <View style={styles.detailMeta}>
                <Text style={styles.detailMetaText}>
                  📍 {formatDistance(selectedIncident.distance)}
                </Text>
                <Text style={styles.detailMetaText}>
                  🕐 {formatTimeAgo(selectedIncident.createdAt)}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.detailClose} onPress={() => setSelectedIncident(null)}>
              <Text style={styles.detailCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.detailDesc}>{selectedIncident.description}</Text>

          <View style={styles.detailActions}>
            <TouchableOpacity style={styles.upvoteBtn} onPress={() => handleUpvote(selectedIncident.id)}>
              <Text style={styles.upvoteIcon}>👍</Text>
              <Text style={styles.upvoteCount}>{selectedIncident.upvotes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text style={styles.shareBtnText}>📤 分享</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn}>
              <Text style={styles.navBtnText}>🧭 導航</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Report FAB */}
      <TouchableOpacity style={styles.reportFab} onPress={() => setShowReportModal(true)}>
        <Text style={styles.reportFabIcon}>📢</Text>
        <Text style={styles.reportFabText}>{t('reportIncident')}</Text>
      </TouchableOpacity>

      {/* Bottom list */}
      <View style={styles.bottomList}>
        <Text style={styles.bottomListTitle}>📍 事件列表 (近→遠)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomListContent}>
          {filteredIncidents.slice(0, 5).map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={[
                styles.bottomCard,
                selectedIncident?.id === incident.id && styles.bottomCardSelected,
              ]}
              onPress={() => {
                setSelectedIncident(incident);
                mapRef.current?.animateToRegion({
                  latitude: incident.lat,
                  longitude: incident.lng,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }, 500);
              }}
            >
              <View style={[styles.bottomCardIcon, { backgroundColor: incidentColors[incident.type] + '20' }]}>
                <IncidentIcon type={incident.type} size={18} />
              </View>
              <Text style={styles.bottomCardTitle} numberOfLines={1}>{incident.title}</Text>
              <View style={styles.bottomCardDist}>
                <Text style={styles.bottomCardDistText}>{formatDistance(incident.distance)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Report Modal */}
      <Modal visible={showReportModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📢 報料</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>事件類型</Text>
            <View style={styles.typeSelector}>
              {(['accident', 'traffic', 'event', 'weather', 'other'] as IncidentType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeOption, reportType === type && styles.typeOptionSelected]}
                  onPress={() => setReportType(type)}
                >
                  <IncidentIcon type={type} size={22} />
                  <Text style={[styles.typeOptionText, reportType === type && styles.typeOptionTextSelected]}>
                    {type === 'accident' ? '🚨 意外' :
                     type === 'traffic' ? '🚗 塞車' :
                     type === 'event' ? '🎉 活動' :
                     type === 'weather' ? '⛈️ 天氣' : '📍 其他'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>描述事件</Text>
            <TextInput
              style={styles.reportInput}
              placeholder="簡單描述下..."
              placeholderTextColor="#999"
              multiline
              value={reportDescription}
              onChangeText={setReportDescription}
            />

            <View style={styles.reportMedia}>
              <TouchableOpacity style={styles.reportMediaBtn}>
                <Text style={styles.reportMediaIcon}>📷</Text>
                <Text style={styles.reportMediaText}>加相</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportMediaBtn}>
                <Text style={styles.reportMediaIcon}>🎤</Text>
                <Text style={styles.reportMediaText}>錄音</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.reportSubmit}
              onPress={() => {
                Alert.alert('已提交', '多謝你既報料！我地會盡快處理');
                setShowReportModal(false);
                setReportDescription('');
              }}
            >
              <Text style={styles.reportSubmitText}>提交 📤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  locationBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  locationBtnIcon: { fontSize: 20 },
  filterContainer: { backgroundColor: '#FFF', paddingVertical: 10 },
  filterContent: { paddingHorizontal: 16, gap: 6 },
  filterTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, backgroundColor: '#F5F5F5', marginRight: 6 },
  filterTabActive: { backgroundColor: '#FF6B35' },
  filterIcon: { fontSize: 13, marginRight: 5 },
  filterText: { fontSize: 13, color: '#666' },
  filterTextActive: { color: '#FFF', fontWeight: '600' },
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  markerContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5 },
  mapControls: { position: 'absolute', right: 16, top: 16, gap: 8 },
  mapControlBtn: { width: 44, height: 44, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  mapControlIcon: { fontSize: 20, color: '#666' },
  layersBtn: { position: 'absolute', left: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  layersIcon: { fontSize: 16, marginRight: 6 },
  layersText: { fontSize: 13, color: '#666', fontWeight: '500' },
  detailCard: { position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailIconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  detailInfo: { flex: 1 },
  detailTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  detailMeta: { flexDirection: 'row', gap: 12 },
  detailMetaText: { fontSize: 11, color: '#666' },
  detailClose: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  detailCloseText: { fontSize: 14, color: '#666' },
  detailDesc: { fontSize: 13, color: '#666', lineHeight: 19, marginBottom: 12 },
  detailActions: { flexDirection: 'row', gap: 8 },
  upvoteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F0', paddingVertical: 11, borderRadius: 12, gap: 5 },
  upvoteIcon: { fontSize: 18 },
  upvoteCount: { fontSize: 15, color: '#FF6B35', fontWeight: '600' },
  shareBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', paddingVertical: 11, borderRadius: 12 },
  shareBtnText: { fontSize: 13, color: '#666', fontWeight: '500' },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1976D2', paddingVertical: 11, borderRadius: 12 },
  navBtnText: { fontSize: 13, color: '#FFF', fontWeight: '500' },
  reportFab: { position: 'absolute', right: 16, bottom: 220, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B35', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 26, shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  reportFabIcon: { fontSize: 18, marginRight: 8 },
  reportFabText: { fontSize: 14, color: '#FFF', fontWeight: '600' },
  bottomList: { backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  bottomListTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  bottomListContent: { gap: 10 },
  bottomCard: { width: 100, padding: 10, backgroundColor: '#F8F8F8', borderRadius: 12, alignItems: 'center', marginRight: 10 },
  bottomCardSelected: { backgroundColor: '#FFF5F0', borderWidth: 2, borderColor: '#FF6B35' },
  bottomCardIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  bottomCardTitle: { fontSize: 11, color: '#666', textAlign: 'center', marginBottom: 4 },
  bottomCardDist: { backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  bottomCardDistText: { fontSize: 9, color: '#1976D2' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalClose: { fontSize: 22, color: '#999' },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 12 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, backgroundColor: '#F5F5F5', marginRight: 6, marginBottom: 6 },
  typeOptionSelected: { backgroundColor: '#FFF5F0', borderWidth: 2, borderColor: '#FF6B35' },
  typeOptionText: { fontSize: 12, color: '#666', marginLeft: 5 },
  typeOptionTextSelected: { color: '#FF6B35', fontWeight: '600' },
  reportInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', minHeight: 90, textAlignVertical: 'top' },
  reportMedia: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 14 },
  reportMediaBtn: { alignItems: 'center', padding: 12, backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 24 },
  reportMediaIcon: { fontSize: 24, marginBottom: 4 },
  reportMediaText: { fontSize: 12, color: '#666' },
  reportSubmit: { backgroundColor: '#FF6B35', borderRadius: 24, padding: 15, alignItems: 'center', marginTop: 4 },
  reportSubmitText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default MapScreen;
