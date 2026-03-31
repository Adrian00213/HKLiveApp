import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockIncidents } from '../services/mockData';
import { useAppStore } from '../store/appStore';

export default function MapScreen() {
  const { setIncidents } = useAppStore();
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState('accident');
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    setIncidents(mockIncidents);
  }, []);

  const types = [
    { key: 'all', label: '全部', emoji: '📍' },
    { key: 'accident', label: '意外', emoji: '🚨' },
    { key: 'traffic', label: '塞車', emoji: '🚗' },
    { key: 'event', label: '活動', emoji: '🎉' },
    { key: 'weather', label: '天氣', emoji: '⛈️' },
  ];

  const colors: Record<string, string> = {
    accident: '#F44336',
    traffic: '#FF5722',
    event: '#FF9800',
    weather: '#2196F3',
    other: '#9E9E9E',
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'accident': return '🚨';
      case 'traffic': return '🚗';
      case 'event': return '🎉';
      case 'weather': return '⛈️';
      default: return '📍';
    }
  };

  const filtered = filter === 'all' 
    ? mockIncidents 
    : mockIncidents.filter(i => i.type === filter);

  const handleUpvote = (id: string) => {
    setIncidents(mockIncidents.map(i => 
      i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i
    ));
    if (selectedIncident?.id === id) {
      setSelectedIncident({ ...selectedIncident, upvotes: selectedIncident.upvotes + 1 });
    }
  };

  const handleReport = () => {
    Alert.alert('已提交', '多謝報料！我們會盡快處理');
    setShowReport(false);
    setReportText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HKLive</Text>
        <Text style={styles.headerSubtitle}>🗺️ {filtered.length}個附近事件 · 由近到遠</Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapTitle}>香港島及九龍區</Text>
          <Text style={styles.mapSubtitle}>實時顯示附近事件</Text>
          
          {/* Markers on map */}
          <View style={styles.markersContainer}>
            {filtered.slice(0, 5).map((incident, index) => {
              const positions = [
                { top: '20%', left: '25%' },
                { top: '30%', left: '60%' },
                { top: '45%', left: '35%' },
                { top: '55%', left: '70%' },
                { top: '65%', left: '45%' },
              ];
              const pos = positions[index] || positions[0];
              return (
                <TouchableOpacity
                  key={incident.id}
                  style={[styles.marker, { top: pos.top, left: pos.left, borderColor: colors[incident.type] || colors.other }]}
                  onPress={() => setSelectedIncident(incident)}
                >
                  <Text style={styles.markerEmoji}>{getIcon(incident.type)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {types.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[styles.filterTab, filter === type.key && styles.filterTabActive]}
              onPress={() => setFilter(type.key)}
            >
              <Text style={styles.filterEmoji}>{type.emoji}</Text>
              <Text style={[styles.filterText, filter === type.key && styles.filterTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Incident List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>📍 附近事件</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={[styles.incidentCard, selectedIncident?.id === incident.id && styles.incidentCardSelected]}
              onPress={() => setSelectedIncident(incident)}
            >
              <View style={[styles.incidentIcon, { backgroundColor: (colors[incident.type] || colors.other) + '20' }]}>
                <Text style={styles.incidentEmoji}>{getIcon(incident.type)}</Text>
              </View>
              <View style={styles.incidentInfo}>
                <Text style={styles.incidentTitle} numberOfLines={1}>{incident.title}</Text>
                <Text style={styles.incidentDesc} numberOfLines={1}>{incident.description}</Text>
              </View>
              <View style={styles.incidentDist}>
                <Text style={styles.distText}>{incident.distance?.toFixed(1)}km</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowReport(true)}>
        <Text style={styles.fabIcon}>📢</Text>
        <Text style={styles.fabText}>報料</Text>
      </TouchableOpacity>

      {/* Detail Modal */}
      {selectedIncident && (
        <View style={styles.detailModal}>
          <View style={styles.detailHeader}>
            <View style={[styles.detailIcon, { backgroundColor: (colors[selectedIncident.type] || colors.other) + '20' }]}>
              <Text style={styles.detailIconEmoji}>{getIcon(selectedIncident.type)}</Text>
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailTitle}>{selectedIncident.title}</Text>
              <Text style={styles.detailMeta}>📍 {selectedIncident.distance?.toFixed(1)}km</Text>
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

      {/* Report Modal */}
      <Modal visible={showReport} transparent animationType="slide">
        <View style={styles.reportModal}>
          <View style={styles.reportContent}>
            <Text style={styles.reportTitle}>📢 報料</Text>
            <View style={styles.typeSelector}>
              {types.filter(t => t.key !== 'all').map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[styles.typeOption, reportType === type.key && styles.typeOptionActive]}
                  onPress={() => setReportType(type.key)}
                >
                  <Text style={styles.typeEmoji}>{type.emoji}</Text>
                  <Text style={styles.typeText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reportInput}
              placeholder="描述事件..."
              placeholderTextColor="#999"
              multiline
              value={reportText}
              onChangeText={setReportText}
            />
            <View style={styles.reportActions}>
              <TouchableOpacity style={styles.reportCancel} onPress={() => setShowReport(false)}>
                <Text style={styles.reportCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportSubmit} onPress={handleReport}>
                <Text style={styles.reportSubmitText}>提交</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#FFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  mapContainer: { height: '35%', padding: 16 },
  mapPlaceholder: { flex: 1, backgroundColor: '#E8F4F8', borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mapIcon: { fontSize: 50 },
  mapTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 8 },
  mapSubtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  markersContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  marker: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  markerEmoji: { fontSize: 20 },
  filterContainer: { backgroundColor: '#FFF', paddingVertical: 10 },
  filterTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#F5F5F5', borderRadius: 20, marginHorizontal: 6 },
  filterTabActive: { backgroundColor: '#FF6B35' },
  filterEmoji: { fontSize: 14, marginRight: 5 },
  filterText: { fontSize: 13, color: '#666' },
  filterTextActive: { color: '#FFF', fontWeight: '600' },
  listContainer: { flex: 1, padding: 16 },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  incidentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  incidentCardSelected: { borderWidth: 2, borderColor: '#FF6B35' },
  incidentIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  incidentEmoji: { fontSize: 24 },
  incidentInfo: { flex: 1 },
  incidentTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  incidentDesc: { fontSize: 13, color: '#666' },
  incidentDist: { marginLeft: 8 },
  distText: { fontSize: 12, color: '#1976D2', fontWeight: '600' },
  fab: { position: 'absolute', right: 16, bottom: 200, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B35', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 26, shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  fabIcon: { fontSize: 18, marginRight: 8 },
  fabText: { fontSize: 14, color: '#FFF', fontWeight: '600' },
  detailModal: { position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailIcon: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  detailIconEmoji: { fontSize: 26 },
  detailInfo: { flex: 1 },
  detailTitle: { fontSize: 17, fontWeight: '600', color: '#333' },
  detailMeta: { fontSize: 12, color: '#666', marginTop: 4 },
  detailClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  detailCloseText: { fontSize: 14, color: '#666' },
  detailDesc: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 14 },
  detailActions: { flexDirection: 'row', gap: 8 },
  upvoteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F0', paddingVertical: 12, borderRadius: 12, gap: 5 },
  upvoteIcon: { fontSize: 18 },
  upvoteCount: { fontSize: 15, color: '#FF6B35', fontWeight: '600' },
  shareBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', paddingVertical: 12, borderRadius: 12 },
  shareBtnText: { fontSize: 14, color: '#666', fontWeight: '500' },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1976D2', paddingVertical: 12, borderRadius: 12 },
  navBtnText: { fontSize: 14, color: '#FFF', fontWeight: '500' },
  reportModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  reportContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  reportTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F5F5F5', borderRadius: 12 },
  typeOptionActive: { backgroundColor: '#FFF5F0', borderWidth: 2, borderColor: '#FF6B35' },
  typeEmoji: { fontSize: 16, marginRight: 5 },
  typeText: { fontSize: 13, color: '#666' },
  reportInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top', color: '#333' },
  reportActions: { flexDirection: 'row', marginTop: 16, gap: 12 },
  reportCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', paddingVertical: 14, borderRadius: 24 },
  reportCancelText: { fontSize: 15, color: '#666' },
  reportSubmit: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 24 },
  reportSubmitText: { fontSize: 15, color: '#FFF', fontWeight: '600' },
});
