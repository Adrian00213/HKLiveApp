import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockEvents, mockDeals, mockDiscussions, mockWeather, mockAqhi, mockMtrStatus, mockBusArrivals } from '../services/mockData';

export default function InfoScreen() {
  const [activeTab, setActiveTab] = useState('events');
  const [showPost, setShowPost] = useState(false);
  const [postText, setPostText] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  const tabs = [
    { key: 'events', label: '活動', emoji: '🎭' },
    { key: 'deals', label: '優惠', emoji: '🎫' },
    { key: 'transport', label: '交通', emoji: '🚌' },
    { key: 'weather', label: '天氣', emoji: '🌤️' },
    { key: 'discussion', label: '吹水', emoji: '💬' },
  ];

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'concert': return '🎤';
      case 'festival': return '🎪';
      case 'exhibition': return '🎭';
      case 'sports': return '🏃';
      default: return '📍';
    }
  };

  const getMtrColor = (status: string) => {
    switch(status) {
      case 'normal': return '#4CAF50';
      case 'delayed': return '#FF9800';
      case 'partial': return '#F44336';
      default: return '#999';
    }
  };

  const getAqhiColor = (level: string) => {
    switch(level) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'high': return '#FF9800';
      case 'very-high': return '#F44336';
      default: return '#999';
    }
  };

  const formatExpiry = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours/24)}日`;
    if (hours > 0) return `${hours}個鐘`;
    return `${mins}分鐘`;
  };

  const sortedEvents = sortBy === 'distance' 
    ? [...mockEvents].sort((a, b) => (a.distance || 999) - (b.distance || 999))
    : [...mockEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sortedDeals = [...mockDeals].sort((a, b) => (a.distance || 999) - (b.distance || 999));

  const sortedBus = [...mockBusArrivals].sort((a, b) => (a.distance || 999) - (b.distance || 999));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>資訊</Text>
        <Text style={styles.headerSubtitle}>📍 油尖旺 · 由近到遠</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.tabEmoji}>{tab.emoji}</Text>
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Toggle */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>篩選：</Text>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'distance' && styles.sortBtnActive]}
          onPress={() => setSortBy('distance')}
        >
          <Text style={[styles.sortBtnText, sortBy === 'distance' && styles.sortBtnTextActive]}>📍 最近</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'time' && styles.sortBtnActive]}
          onPress={() => setSortBy('time')}
        >
          <Text style={[styles.sortBtnText, sortBy === 'time' && styles.sortBtnTextActive]}>🕐 最新</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Events */}
        {activeTab === 'events' && (
          <View>
            <Text style={styles.sectionTitle}>🎭 活動</Text>
            {sortedEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventIcon}>
                    <Text style={styles.eventEmoji}>{getEventIcon(event.type)}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={styles.eventVenue}>📍 {event.venue}</Text>
                    <Text style={styles.eventDate}>📅 {event.date} {event.time}</Text>
                  </View>
                  <View style={styles.eventPrice}>
                    <Text style={styles.priceText}>{event.price}</Text>
                  </View>
                </View>
                <View style={styles.eventFooter}>
                  <Text style={styles.eventDist}>📍 {event.distance?.toFixed(1)}km</Text>
                  <TouchableOpacity style={styles.interestedBtn}>
                    <Text style={styles.interestedBtnText}>❤️ 有興趣</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Deals */}
        {activeTab === 'deals' && (
          <View>
            <Text style={styles.sectionTitle}>🎫 優惠</Text>
            {sortedDeals.map((deal) => (
              <View key={deal.id} style={styles.dealCard}>
                <View style={styles.dealHeader}>
                  <View style={styles.dealInfo}>
                    <Text style={styles.dealMerchant}>{deal.merchantName}</Text>
                    <Text style={styles.dealTitle}>{deal.title}</Text>
                    <Text style={styles.dealDesc}>{deal.description}</Text>
                  </View>
                  <View style={styles.dealRight}>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{deal.discount}</Text>
                    </View>
                    <Text style={styles.dealDist}>📍 {deal.distance?.toFixed(1)}km</Text>
                  </View>
                </View>
                <View style={styles.dealFooter}>
                  <Text style={styles.expiry}>⏰ {formatExpiry(deal.expiry)} 到期</Text>
                  <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>💾 儲起</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Transport */}
        {activeTab === 'transport' && (
          <View>
            <Text style={styles.sectionTitle}>🚇 港鐵狀況</Text>
            <View style={styles.mtrCard}>
              {mockMtrStatus.map((line, i) => (
                <View key={i} style={styles.mtrLine}>
                  <View style={[styles.mtrDot, { backgroundColor: getMtrColor(line.status) }]} />
                  <Text style={styles.mtrName}>{line.line}</Text>
                  <Text style={[styles.mtrStatus, { color: getMtrColor(line.status) }]}>
                    {line.status === 'normal' ? '正常' : line.status === 'delayed' ? '延誤' : '部分'}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>🚌 巴士到站</Text>
            {sortedBus.map((bus, i) => (
              <View key={i} style={styles.busCard}>
                <View style={styles.busRoute}>
                  <Text style={styles.busRouteText}>{bus.route}</Text>
                </View>
                <View style={styles.busInfo}>
                  <Text style={styles.busDest}>→ {bus.destination}</Text>
                  <Text style={styles.busDist}>📍 {bus.distance?.toFixed(1)}km</Text>
                </View>
                <View style={styles.busEta}>
                  <Text style={styles.etaValue}>{bus.eta}</Text>
                  <Text style={styles.etaUnit}>分鐘</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Weather */}
        {activeTab === 'weather' && (
          <View>
            <View style={styles.weatherCard}>
              <Text style={styles.weatherIcon}>☀️</Text>
              <View style={styles.weatherMain}>
                <Text style={styles.weatherTemp}>{mockWeather.temperature}°C</Text>
                <Text style={styles.weatherDesc}>{mockWeather.description}</Text>
              </View>
              <View style={styles.weatherDetails}>
                <Text style={styles.weatherDetail}>體感 {mockWeather.feelsLike}°C</Text>
                <Text style={styles.weatherDetail}>濕度 {mockWeather.humidity}%</Text>
                <Text style={styles.weatherDetail}>紫外線 {mockWeather.uvIndex}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>💨 空氣質素</Text>
            <View style={styles.aqhiGrid}>
              {mockAqhi.sort((a, b) => a.value - b.value).map((item, i) => (
                <View key={i} style={styles.aqhiItem}>
                  <View style={[styles.aqhiBadge, { backgroundColor: getAqhiColor(item.level) }]}>
                    <Text style={styles.aqhiValue}>{item.value}</Text>
                  </View>
                  <Text style={styles.aqhiDistrict}>{item.district}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Discussion */}
        {activeTab === 'discussion' && (
          <View>
            <View style={styles.discHeader}>
              <TouchableOpacity style={styles.discTabActive}>
                <Text style={styles.discTabActiveText}>🔥 熱門</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.discTab}>
                <Text style={styles.discTabText}>🆕 最新</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={() => setShowPost(true)}>
                <Text style={styles.createBtnText}>✏️ 發帖</Text>
              </TouchableOpacity>
            </View>

            {mockDiscussions.map((disc) => (
              <View key={disc.id} style={styles.discCard}>
                <View style={styles.discMeta}>
                  <Text style={styles.discDistrict}>📍 {disc.district}</Text>
                  <Text style={styles.discAuthor}>{disc.isAnonymous ? '匿名' : disc.authorName}</Text>
                </View>
                <Text style={styles.discTitle}>{disc.title}</Text>
                <Text style={styles.discContent} numberOfLines={2}>{disc.content}</Text>
                <View style={styles.discStats}>
                  <Text style={styles.discStat}>👍 42</Text>
                  <Text style={styles.discStat}>💬 {disc.commentCount}</Text>
                  <Text style={styles.discDist}>📍 {disc.distance?.toFixed(1)}km</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Post Modal */}
      <Modal visible={showPost} transparent animationType="slide">
        <View style={styles.postModal}>
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>✏️ 發帖吹水</Text>
            <TextInput
              style={styles.postInput}
              placeholder="分享下啦..."
              placeholderTextColor="#999"
              multiline
              value={postText}
              onChangeText={setPostText}
            />
            <View style={styles.postMedia}>
              <TouchableOpacity style={styles.mediaBtn}>
                <Text style={styles.mediaBtnText}>📷 相片</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaBtn}>
                <Text style={styles.mediaBtnText}>🎬 影片</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaBtn}>
                <Text style={styles.mediaBtnText}>🎤 語音</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.postCancel} onPress={() => setShowPost(false)}>
                <Text style={styles.postCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postSubmit}>
                <Text style={styles.postSubmitText}>發布</Text>
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
  tabsContainer: { backgroundColor: '#FFF', paddingVertical: 10 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#F5F5F5', borderRadius: 20, marginHorizontal: 6 },
  tabActive: { backgroundColor: '#FF6B35' },
  tabEmoji: { fontSize: 14, marginRight: 5 },
  tabText: { fontSize: 13, color: '#666' },
  tabTextActive: { color: '#FFF', fontWeight: '600' },
  sortContainer: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
  sortLabel: { fontSize: 13, color: '#666', marginRight: 10 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F0F0F0', borderRadius: 14, marginRight: 8 },
  sortBtnActive: { backgroundColor: '#FF6B35' },
  sortBtnText: { fontSize: 12, color: '#666' },
  sortBtnTextActive: { color: '#FFF', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 8 },
  eventCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10 },
  eventHeader: { flexDirection: 'row', marginBottom: 10 },
  eventIcon: { width: 48, height: 48, backgroundColor: '#FFE5DC', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  eventEmoji: { fontSize: 24 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  eventVenue: { fontSize: 12, color: '#666', marginBottom: 2 },
  eventDate: { fontSize: 12, color: '#999' },
  eventPrice: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  priceText: { fontSize: 13, color: '#4CAF50', fontWeight: '600' },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  eventDist: { fontSize: 12, color: '#1976D2' },
  interestedBtn: { backgroundColor: '#FFF5F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  interestedBtnText: { fontSize: 12, color: '#FF6B35' },
  dealCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10 },
  dealHeader: { flexDirection: 'row', marginBottom: 10 },
  dealInfo: { flex: 1 },
  dealMerchant: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  dealTitle: { fontSize: 14, color: '#333', marginBottom: 4 },
  dealDesc: { fontSize: 13, color: '#666' },
  dealRight: { alignItems: 'flex-end' },
  discountBadge: { backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 6 },
  discountText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
  dealDist: { fontSize: 12, color: '#1976D2' },
  dealFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  expiry: { fontSize: 12, color: '#FF6B35' },
  saveBtn: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  saveBtnText: { fontSize: 12, color: '#666' },
  mtrCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 16 },
  mtrLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  mtrDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  mtrName: { flex: 1, fontSize: 14, color: '#333' },
  mtrStatus: { fontSize: 13, fontWeight: '600' },
  busCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 10 },
  busRoute: { width: 44, height: 44, backgroundColor: '#1976D2', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  busRouteText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
  busInfo: { flex: 1 },
  busDest: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 4 },
  busDist: { fontSize: 12, color: '#1976D2' },
  busEta: { alignItems: 'center' },
  etaValue: { fontSize: 22, fontWeight: 'bold', color: '#FF6B35' },
  etaUnit: { fontSize: 10, color: '#666' },
  weatherCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  weatherIcon: { fontSize: 52, marginRight: 14 },
  weatherMain: { flex: 1 },
  weatherTemp: { fontSize: 40, fontWeight: 'bold', color: '#333' },
  weatherDesc: { fontSize: 14, color: '#666' },
  weatherDetails: { alignItems: 'flex-end' },
  weatherDetail: { fontSize: 12, color: '#666', marginBottom: 4 },
  aqhiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  aqhiItem: { width: '31%', backgroundColor: '#FFF', borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 8 },
  aqhiBadge: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  aqhiValue: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
  aqhiDistrict: { fontSize: 10, color: '#666', textAlign: 'center' },
  discHeader: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  discTabActive: { backgroundColor: '#FF6B35', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  discTabActiveText: { fontSize: 13, color: '#FFF', fontWeight: '600' },
  discTab: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  discTabText: { fontSize: 13, color: '#666' },
  createBtn: { marginLeft: 'auto', backgroundColor: '#FF6B35', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  createBtnText: { fontSize: 13, color: '#FFF', fontWeight: '600' },
  discCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10 },
  discMeta: { flexDirection: 'row', marginBottom: 8, gap: 10 },
  discDistrict: { fontSize: 12, color: '#1976D2', backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  discAuthor: { fontSize: 12, color: '#666' },
  discTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 6 },
  discContent: { fontSize: 13, color: '#666', lineHeight: 18 },
  discStats: { flexDirection: 'row', marginTop: 10, gap: 16 },
  discStat: { fontSize: 12, color: '#666' },
  discDist: { fontSize: 12, color: '#1976D2', marginLeft: 'auto' },
  postModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  postContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  postInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top', color: '#333' },
  postMedia: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  mediaBtn: { backgroundColor: '#F5F5F5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  mediaBtnText: { fontSize: 14, color: '#666' },
  postActions: { flexDirection: 'row', gap: 12 },
  postCancel: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', paddingVertical: 14, borderRadius: 24 },
  postCancelText: { fontSize: 15, color: '#666' },
  postSubmit: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 24 },
  postSubmitText: { fontSize: 15, color: '#FFF', fontWeight: '600' },
});
