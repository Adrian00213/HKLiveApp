import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../i18n/useTranslation';
import {
  mockDeals,
  mockEvents,
  mockDiscussions,
  mockWeather,
  mockAqhi,
  mockMtrStatus,
  mockBusArrivals,
} from '../services/mockData';
import { Deal, Event, Discussion, AQHI, MTRStatus, BusArrival } from '../types';

const InfoScreen: React.FC = () => {
  const { t } = useTranslation();
  const { deals, setDeals, discussions, setDiscussions, mtrStatus, setMtrStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'events' | 'deals' | 'transport' | 'weather' | 'discussion'>('events');
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'time'>('distance');
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setDeals(mockDeals);
      setDiscussions(mockDiscussions);
      setMtrStatus(mockMtrStatus);
      setIsLoading(false);
    }, 600);
  }, []);

  // Sort by distance helper
  const sortByDistance = <T extends { distance?: number }>(items: T[]): T[] => {
    return [...items].sort((a, b) => (a.distance || 999) - (b.distance || 999));
  };

  // Get user location (mock)
  const userLocation = { lat: 22.3193, lng: 114.1694 };

  // Filter and sort events
  const sortedEvents = useMemo(() => {
    const filtered = selectedEventType === 'all'
      ? mockEvents
      : mockEvents.filter(e => e.type === selectedEventType);
    return sortBy === 'distance' 
      ? sortByDistance(filtered)
      : [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedEventType, sortBy]);

  // Sort deals by distance
  const sortedDeals = useMemo(() => sortByDistance(mockDeals), []);

  // Sort bus arrivals by distance and ETA
  const sortedBusArrivals = useMemo(() => {
    return [...mockBusArrivals].sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance || 999) - (b.distance || 999);
      }
      return a.eta - b.eta;
    });
  }, [sortBy]);

  const getAqhiColor = (level: AQHI['level']) => {
    const colors = { low: '#4CAF50', medium: '#FFC107', high: '#FF9800', 'very-high': '#F44336' };
    return colors[level];
  };

  const getAqhiText = (level: AQHI['level']) => {
    const texts = { low: t('low'), medium: t('medium'), high: t('high'), 'very-high': t('veryHigh') };
    return texts[level];
  };

  const getMtrStatusColor = (status: MTRStatus['status']) => {
    const colors = { normal: '#4CAF50', delayed: '#FF9800', partial: '#F44336' };
    return colors[status];
  };

  const getMtrStatusText = (status: MTRStatus['status']) => {
    const texts = { normal: t('normal'), delayed: t('delayed'), partial: t('partial') };
    return texts[status];
  };

  const formatExpiry = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}日`;
    if (hours > 0) return `${hours}個鐘`;
    return `${minutes}分鐘`;
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

  const formatDistance = (km?: number) => {
    if (!km) return '好近';
    if (km < 0.1) return '0.1km';
    return `${km.toFixed(1)}km`;
  };

  const getEventIcon = (type: Event['type']) => {
    const icons = { concert: '🎤', exhibition: '🎭', festival: '🎪', sports: '🏃' };
    return icons[type];
  };

  const eventTypes = [
    { key: 'all', label: '全部', icon: '📍' },
    { key: 'concert', label: '演唱會', icon: '🎤' },
    { key: 'festival', label: '市集', icon: '🎪' },
    { key: 'exhibition', label: '展覽', icon: '🎭' },
    { key: 'sports', label: '運動', icon: '🏃' },
  ];

  const tabs = [
    { key: 'events', label: '活動', icon: '🎭' },
    { key: 'deals', label: '即減', icon: '🎫' },
    { key: 'transport', label: '交通', icon: '🚌' },
    { key: 'weather', label: '天氣', icon: '🌤️' },
    { key: 'discussion', label: '吹水', icon: '💬' },
  ] as const;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('info')}</Text>
          <Text style={styles.headerSubtitle}>📍 油尖旺 · 由近到遠</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Toggle */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>{t('sortByDistance')}</Text>
        <View style={styles.sortToggle}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'distance' && styles.sortBtnActive]}
            onPress={() => setSortBy('distance')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'distance' && styles.sortBtnTextActive]}>
              📍 最近
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'time' && styles.sortBtnActive]}
            onPress={() => setSortBy('time')}
          >
            <Text style={[styles.sortBtnText, sortBy === 'time' && styles.sortBtnTextActive]}>
              🕐 最新
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Events Tab */}
        {activeTab === 'events' && (
          <View>
            {/* Event Type Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventFilterScroll}>
              <View style={styles.eventFilter}>
                {eventTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[styles.eventFilterTab, selectedEventType === type.key && styles.eventFilterTabActive]}
                    onPress={() => setSelectedEventType(type.key)}
                  >
                    <Text style={styles.eventFilterIcon}>{type.icon}</Text>
                    <Text style={[styles.eventFilterText, selectedEventType === type.key && styles.eventFilterTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Featured Event - nearest popular one */}
            {sortedEvents[0] && (
              <View style={styles.featuredEvent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeIcon}>🔥</Text>
                  <Text style={styles.featuredBadgeText}>{t('featuredEvent')}</Text>
                </View>
                <View style={styles.featuredContent}>
                  <View style={styles.featuredHeader}>
                    <Text style={styles.featuredTitle}>{getEventIcon(sortedEvents[0].type)} {sortedEvents[0].title}</Text>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>📍 {formatDistance(sortedEvents[0].distance)}</Text>
                    </View>
                  </View>
                  <Text style={styles.featuredVenue}>🏠 {sortedEvents[0].venue}</Text>
                  <View style={styles.featuredMeta}>
                    <Text style={styles.featuredDate}>📅 {sortedEvents[0].date} {sortedEvents[0].time}</Text>
                    <Text style={styles.featuredPrice}>{sortedEvents[0].price}</Text>
                  </View>
                  <View style={styles.featuredFooter}>
                    <View style={styles.attendees}>
                      <Text style={styles.attendeesIcon}>👥</Text>
                      <Text style={styles.attendeesText}>{sortedEvents[0].attendees.toLocaleString()}人想去</Text>
                    </View>
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>🎫 {t('bookNow')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Nearby Events */}
            <Text style={styles.sectionTitle}>👇 {t('near')} (由近到遠)</Text>
            {sortedEvents.slice(1).map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventRow}>
                  <View style={[styles.eventIconBox, { backgroundColor: event.type === 'concert' ? '#FFE5DC' : event.type === 'festival' ? '#E8F5E9' : '#E3F2FD' }]}>
                    <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                      <View style={styles.eventDistBadge}>
                        <Text style={styles.eventDistText}>📍{formatDistance(event.distance)}</Text>
                      </View>
                    </View>
                    <Text style={styles.eventVenue}>🏠 {event.venue}</Text>
                    <View style={styles.eventMeta}>
                      <Text style={styles.eventDate}>📅 {event.date}</Text>
                      <Text style={styles.eventPrice}>{event.price}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.eventFooter}>
                  <Text style={styles.eventAttendees}>👥 {event.attendees.toLocaleString()}人</Text>
                  <View style={styles.eventActions}>
                    <TouchableOpacity style={styles.eventActionBtn}>
                      <Text style={styles.eventActionText}>❤️ {t('interested')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.mapLink}>
              <Text style={styles.mapLinkIcon}>🗺️</Text>
              <Text style={styles.mapLinkText}>{t('viewOnMap')} · {sortedEvents.length}個活動</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Deals Tab - sorted by distance */}
        {activeTab === 'deals' && (
          <View>
            <View style={styles.dealsHeader}>
              <View>
                <Text style={styles.dealsTitle}>🎫 {t('deals')}</Text>
                <Text style={styles.dealsSubtitle}>附近{deals.length}個著數</Text>
              </View>
              <View style={styles.dealsBadges}>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>⏰ 即減</Text>
                </View>
              </View>
            </View>

            {sortedDeals.map((deal) => (
              <View key={deal.id} style={styles.dealCard}>
                <View style={styles.dealMain}>
                  <View style={styles.dealLeft}>
                    <View style={[styles.categoryPill, { backgroundColor: deal.category === 'food' ? '#FFE5DC' : deal.category === 'shopping' ? '#E3F2FD' : '#E8F5E9' }]}>
                      <Text style={[styles.categoryPillText, { color: deal.category === 'food' ? '#FF6B35' : deal.category === 'shopping' ? '#1976D2' : '#4CAF50' }]}>
                        {deal.category === 'food' ? '🍜' : deal.category === 'shopping' ? '🛒' : '🎭'} 
                        {deal.category === 'food' ? '食' : deal.category === 'shopping' ? '買' : '玩'}
                      </Text>
                    </View>
                    <Text style={styles.dealMerchant}>{deal.merchantName}</Text>
                    <Text style={styles.dealTitle}>{deal.title}</Text>
                    <Text style={styles.dealDesc}>{deal.description}</Text>
                  </View>
                  <View style={styles.dealRight}>
                    <View style={styles.discountBox}>
                      <Text style={styles.discountText}>{deal.discount}</Text>
                    </View>
                    <View style={styles.dealDistance}>
                      <Text style={styles.dealDistanceText}>📍{formatDistance(deal.distance)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.dealFooter}>
                  <View style={styles.expiryBox}>
                    <Text style={styles.expiryIcon}>⏰</Text>
                    <Text style={styles.expiryText}>{t('expiresIn')}: {formatExpiry(deal.expiry)}</Text>
                  </View>
                  <View style={styles.dealActions}>
                    <TouchableOpacity style={styles.saveBtn}>
                      <Text style={styles.saveBtnText}>💾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn}>
                      <Text style={styles.shareBtnText}>📤</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Transport Tab - sorted by distance */}
        {activeTab === 'transport' && (
          <View>
            <Text style={styles.sectionTitle}>🚇 {t('mtrStatus')}</Text>
            <View style={styles.mtrContainer}>
              {mtrStatus.map((line, index) => (
                <View key={index} style={styles.mtrLine}>
                  <View style={[styles.mtrDot, { backgroundColor: getMtrStatusColor(line.status) }]} />
                  <Text style={styles.mtrLineName}>{line.line}</Text>
                  <View style={[styles.mtrStatusBadge, { backgroundColor: getMtrStatusColor(line.status) + '20' }]}>
                    <Text style={[styles.mtrStatusText, { color: getMtrStatusColor(line.status) }]}>
                      {getMtrStatusText(line.status)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>🚌 {t('busArrival')} (最近→最遠)</Text>
            <View style={styles.busList}>
              {sortedBusArrivals.map((bus, index) => (
                <View key={index} style={styles.busCard}>
                  <View style={styles.busLeft}>
                    <View style={styles.busRouteBox}>
                      <Text style={styles.busRoute}>{bus.route}</Text>
                    </View>
                    <View style={styles.busInfo}>
                      <Text style={styles.busDest}>→ {bus.destination}</Text>
                      <View style={styles.busMeta}>
                        <View style={styles.busDistanceTag}>
                          <Text style={styles.busDistanceText}>📍{formatDistance(bus.distance)}</Text>
                        </View>
                        <Text style={styles.busCapacity}>
                          🚍 {bus.capacity === 'high' ? '🟢' : bus.capacity === 'medium' ? '🟡' : '🔴'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.busRight}>
                    <View style={styles.etaBox}>
                      <Text style={styles.etaValue}>{bus.eta}</Text>
                      <Text style={styles.etaUnit}>分鐘</Text>
                    </View>
                    <TouchableOpacity style={styles.remindBtn}>
                      <Text style={styles.remindBtnText}>⏰</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.nearbyStops}>
              <Text style={styles.nearbyStopsIcon}>📍</Text>
              <Text style={styles.nearbyStopsText}>查看附近車站 · {mockBusArrivals.length}個站</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && (
          <View>
            <View style={styles.weatherCard}>
              <View style={styles.weatherTop}>
                <Text style={styles.weatherIcon}>☀️</Text>
                <View style={styles.weatherMain}>
                  <Text style={styles.weatherTemp}>{mockWeather.temperature}°C</Text>
                  <Text style={styles.weatherDesc}>{mockWeather.description}</Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherItemIcon}>🌡️</Text>
                  <Text style={styles.weatherItemLabel}>{t('feelsLike')}</Text>
                  <Text style={styles.weatherItemValue}>{mockWeather.feelsLike}°C</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherItemIcon}>💧</Text>
                  <Text style={styles.weatherItemLabel}>{t('humidity')}</Text>
                  <Text style={styles.weatherItemValue}>{mockWeather.humidity}%</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherItemIcon}>☀️</Text>
                  <Text style={styles.weatherItemLabel}>{t('uvIndex')}</Text>
                  <Text style={styles.weatherItemValue}>{mockWeather.uvIndex}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>💨 {t('aqhiTitle')} · 18區</Text>
            <View style={styles.aqhiGrid}>
              {mockAqhi.sort((a, b) => a.value - b.value).map((item, index) => (
                <View key={index} style={styles.aqhiItem}>
                  <View style={[styles.aqhiBadge, { backgroundColor: getAqhiColor(item.level) }]}>
                    <Text style={styles.aqhiValue}>{item.value}</Text>
                  </View>
                  <Text style={styles.aqhiDistrict}>{item.district}</Text>
                  <Text style={[styles.aqhiLevel, { color: getAqhiColor(item.level) }]}>
                    {getAqhiText(item.level)}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.forecastBtn}>
              <Text style={styles.forecastBtnText}>📅 {t('forecast')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Discussion Tab */}
        {activeTab === 'discussion' && (
          <View>
            <View style={styles.discussionHeader}>
              <View style={styles.discussionTabs}>
                <TouchableOpacity style={styles.discTabActive}>
                  <Text style={styles.discTabActiveText}>🔥 {t('hotTopics')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.discTab}>
                  <Text style={styles.discTabText}>🆕 {t('newPosts')}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.createPostBtn} onPress={() => setShowPostModal(true)}>
                <Text style={styles.createPostIcon}>✏️</Text>
              </TouchableOpacity>
            </View>

            {/* Sort info */}
            <View style={styles.discSortInfo}>
              <Text style={styles.discSortText}>💬 吹水區 · 最近的士話題</Text>
            </View>

            {sortBy === 'distance' 
              ? [...mockDiscussions].sort((a, b) => (a.distance || 999) - (b.distance || 999)).map((discussion) => (
              <View key={discussion.id} style={styles.discCard}>
                <View style={styles.discMeta}>
                  <View style={styles.discLeft}>
                    <View style={styles.districtTag}>
                      <Text style={styles.districtTagText}>📍 {discussion.district}</Text>
                    </View>
                    <View style={styles.authorRow}>
                      <View style={styles.authorAvatar}>
                        <Text style={styles.authorAvatarText}>
                          {discussion.isAnonymous ? '👤' : discussion.authorName.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.authorName}>
                        {discussion.isAnonymous ? t('anonymous') : discussion.authorName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.discRight}>
                    <Text style={styles.discTime}>{formatTimeAgo(discussion.createdAt)}</Text>
                    <Text style={styles.discDist}>📍{formatDistance(discussion.distance)}</Text>
                  </View>
                </View>
                <Text style={styles.discTitle}>{discussion.title}</Text>
                <Text style={styles.discContent} numberOfLines={2}>{discussion.content}</Text>
                <View style={styles.discStats}>
                  <TouchableOpacity style={styles.discStat}>
                    <Text style={styles.discStatIcon}>👍</Text>
                    <Text style={styles.discStatText}>42</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discStat}>
                    <Text style={styles.discStatIcon}>💬</Text>
                    <Text style={styles.discStatText}>{discussion.commentCount}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discStat}>
                    <Text style={styles.discStatIcon}>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
              : [...mockDiscussions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((discussion) => (
              <View key={discussion.id} style={styles.discCard}>
                <View style={styles.discMeta}>
                  <View style={styles.discLeft}>
                    <View style={styles.districtTag}>
                      <Text style={styles.districtTagText}>📍 {discussion.district}</Text>
                    </View>
                    <View style={styles.authorRow}>
                      <View style={styles.authorAvatar}>
                        <Text style={styles.authorAvatarText}>
                          {discussion.isAnonymous ? '👤' : discussion.authorName.charAt(0)}
                        </Text>
                      </View>
                      <Text style={styles.authorName}>
                        {discussion.isAnonymous ? t('anonymous') : discussion.authorName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.discRight}>
                    <Text style={styles.discTime}>{formatTimeAgo(discussion.createdAt)}</Text>
                    <Text style={styles.discDist}>📍{formatDistance(discussion.distance)}</Text>
                  </View>
                </View>
                <Text style={styles.discTitle}>{discussion.title}</Text>
                <Text style={styles.discContent} numberOfLines={2}>{discussion.content}</Text>
                <View style={styles.discStats}>
                  <TouchableOpacity style={styles.discStat}>
                    <Text style={styles.discStatIcon}>👍</Text>
                    <Text style={styles.discStatText}>42</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discStat}>
                    <Text style={styles.discStatIcon}>💬</Text>
                    <Text style={styles.discStatText}>{discussion.commentCount}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.discStat}>
                    <Text style={styles.discStatIcon}>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Create Post Modal */}
      <Modal visible={showPostModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💬 發帖吹水</Text>
              <TouchableOpacity onPress={() => setShowPostModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.postInput}
              placeholder="分享一下啦..."
              placeholderTextColor="#999"
              multiline
              value={postContent}
              onChangeText={setPostContent}
            />

            <View style={styles.mediaSelector}>
              <TouchableOpacity style={styles.mediaOption}>
                <Text style={styles.mediaOptionIcon}>📷</Text>
                <Text style={styles.mediaOptionText}>{t('addPhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaOption}>
                <Text style={styles.mediaOptionIcon}>🎬</Text>
                <Text style={styles.mediaOptionText}>{t('addVideo')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaOption}>
                <Text style={styles.mediaOptionIcon}>🎤</Text>
                <Text style={styles.mediaOptionText}>{t('addVoice')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.postOptions}>
              <View style={styles.districtPicker}>
                <Text style={styles.districtPickerIcon}>📍</Text>
                <Text style={styles.districtPickerText}>油尖旺區</Text>
              </View>
              <TouchableOpacity style={styles.anonToggle}>
                <Text style={styles.anonToggleText}>👤 {t('anonymousPost')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitPost}>
              <Text style={styles.submitPostText}>🚀 {t('postNow')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35' },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  refreshBtn: { width: 40, height: 40, backgroundColor: '#F5F5F5', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  refreshBtnText: { fontSize: 18 },
  tabsContainer: { backgroundColor: '#FFF', paddingVertical: 10 },
  tabs: { paddingHorizontal: 16, gap: 6 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', marginRight: 6 },
  tabActive: { backgroundColor: '#FF6B35' },
  tabIcon: { fontSize: 14, marginRight: 5 },
  tabText: { fontSize: 13, color: '#666' },
  tabTextActive: { color: '#FFF', fontWeight: '600' },
  sortContainer: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sortLabel: { fontSize: 13, color: '#666' },
  sortToggle: { flexDirection: 'row', gap: 6 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#F0F0F0' },
  sortBtnActive: { backgroundColor: '#FF6B35' },
  sortBtnText: { fontSize: 12, color: '#666' },
  sortBtnTextActive: { color: '#FFF', fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 4 },

  // Events styles
  eventFilterScroll: { marginBottom: 14 },
  eventFilter: { flexDirection: 'row', gap: 6 },
  eventFilterTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: '#FFF', marginRight: 6 },
  eventFilterTabActive: { backgroundColor: '#FF6B35' },
  eventFilterIcon: { fontSize: 13, marginRight: 4 },
  eventFilterText: { fontSize: 12, color: '#666' },
  eventFilterTextActive: { color: '#FFF', fontWeight: '600' },
  featuredEvent: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF3B30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  featuredBadgeIcon: { fontSize: 12, marginRight: 4 },
  featuredBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  featuredContent: {},
  featuredHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  featuredTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  distanceBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  distanceText: { fontSize: 11, color: '#1976D2' },
  featuredVenue: { fontSize: 13, color: '#666', marginBottom: 4 },
  featuredMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  featuredDate: { fontSize: 12, color: '#666' },
  featuredPrice: { fontSize: 15, color: '#FF6B35', fontWeight: 'bold' },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  attendees: { flexDirection: 'row', alignItems: 'center' },
  attendeesIcon: { fontSize: 13, marginRight: 4 },
  attendeesText: { fontSize: 12, color: '#666' },
  bookButton: { backgroundColor: '#FF6B35', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  bookButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  eventCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10 },
  eventRow: { flexDirection: 'row', marginBottom: 10 },
  eventIconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  eventIcon: { fontSize: 22 },
  eventInfo: { flex: 1 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  eventTitle: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  eventDistBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  eventDistText: { fontSize: 10, color: '#666' },
  eventVenue: { fontSize: 12, color: '#666', marginBottom: 2 },
  eventMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  eventDate: { fontSize: 11, color: '#999' },
  eventPrice: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  eventAttendees: { fontSize: 11, color: '#666' },
  eventActions: { flexDirection: 'row', gap: 10 },
  eventActionBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#FFF5F0', borderRadius: 10 },
  eventActionText: { fontSize: 12, color: '#FF6B35' },
  mapLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F2FD', borderRadius: 12, padding: 14, marginTop: 6 },
  mapLinkIcon: { fontSize: 18, marginRight: 8 },
  mapLinkText: { fontSize: 14, color: '#1976D2', fontWeight: '600' },

  // Deals styles
  dealsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dealsTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  dealsSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  dealsBadges: { flexDirection: 'row', gap: 6 },
  urgentBadge: { backgroundColor: '#FF6B35', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  urgentBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  dealCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 12 },
  dealMain: { flexDirection: 'row', marginBottom: 10 },
  dealLeft: { flex: 1 },
  categoryPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 },
  categoryPillText: { fontSize: 11, fontWeight: '600' },
  dealMerchant: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 2 },
  dealTitle: { fontSize: 14, color: '#333', marginBottom: 4 },
  dealDesc: { fontSize: 12, color: '#666', lineHeight: 17 },
  dealRight: { alignItems: 'flex-end' },
  discountBox: { backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 6 },
  discountText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dealDistance: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  dealDistanceText: { fontSize: 11, color: '#1976D2' },
  dealFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  expiryBox: { flexDirection: 'row', alignItems: 'center' },
  expiryIcon: { fontSize: 11, marginRight: 4 },
  expiryText: { fontSize: 11, color: '#FF6B35' },
  dealActions: { flexDirection: 'row', gap: 8 },
  saveBtn: { padding: 6 },
  saveBtnText: { fontSize: 16 },
  shareBtn: { padding: 6 },
  shareBtnText: { fontSize: 16 },

  // Transport styles
  mtrContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 8, marginBottom: 16 },
  mtrLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6 },
  mtrDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  mtrLineName: { flex: 1, fontSize: 14, color: '#333' },
  mtrStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  mtrStatusText: { fontSize: 12, fontWeight: '600' },
  busList: { gap: 8 },
  busCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 12 },
  busLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  busRouteBox: { width: 44, height: 44, backgroundColor: '#1976D2', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  busRoute: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  busInfo: { flex: 1 },
  busDest: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 3 },
  busMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  busDistanceTag: { backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  busDistanceText: { fontSize: 10, color: '#1976D2' },
  busCapacity: { fontSize: 11 },
  busRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  etaBox: { alignItems: 'center' },
  etaValue: { fontSize: 22, fontWeight: 'bold', color: '#FF6B35' },
  etaUnit: { fontSize: 10, color: '#666' },
  remindBtn: { width: 36, height: 36, backgroundColor: '#FFF5F0', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  remindBtnText: { fontSize: 16 },
  nearbyStops: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F2FD', borderRadius: 12, padding: 14, marginTop: 12 },
  nearbyStopsIcon: { fontSize: 16, marginRight: 8 },
  nearbyStopsText: { fontSize: 13, color: '#1976D2', fontWeight: '600' },

  // Weather styles
  weatherCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 18, marginBottom: 16 },
  weatherTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  weatherIcon: { fontSize: 52, marginRight: 14 },
  weatherMain: {},
  weatherTemp: { fontSize: 40, fontWeight: 'bold', color: '#333' },
  weatherDesc: { fontSize: 14, color: '#666' },
  weatherDetails: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  weatherItem: { alignItems: 'center' },
  weatherItemIcon: { fontSize: 18, marginBottom: 4 },
  weatherItemLabel: { fontSize: 11, color: '#666', marginBottom: 2 },
  weatherItemValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  aqhiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  aqhiItem: { width: '31%', backgroundColor: '#FFF', borderRadius: 10, padding: 8, alignItems: 'center', marginBottom: 8 },
  aqhiBadge: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  aqhiValue: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  aqhiDistrict: { fontSize: 10, color: '#666', textAlign: 'center' },
  aqhiLevel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
  forecastBtn: { backgroundColor: '#E3F2FD', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10 },
  forecastBtnText: { fontSize: 14, color: '#1976D2', fontWeight: '600' },

  // Discussion styles
  discussionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  discussionTabs: { flexDirection: 'row', gap: 6 },
  discTabActive: { backgroundColor: '#FF6B35', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  discTabActiveText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  discTab: { backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  discTabText: { fontSize: 13, color: '#666' },
  createPostBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center' },
  createPostIcon: { fontSize: 16 },
  discSortInfo: { backgroundColor: '#FFF5F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
  discSortText: { fontSize: 12, color: '#FF6B35' },
  discCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 10 },
  discMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  discLeft: { flex: 1 },
  districtTag: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6 },
  districtTagText: { fontSize: 11, color: '#1976D2' },
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFE5DC', justifyContent: 'center', alignItems: 'center', marginRight: 6 },
  authorAvatarText: { fontSize: 10, color: '#FF6B35' },
  authorName: { fontSize: 12, color: '#666' },
  discRight: { alignItems: 'flex-end' },
  discTime: { fontSize: 11, color: '#999', marginBottom: 2 },
  discDist: { fontSize: 10, color: '#1976D2' },
  discTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 6 },
  discContent: { fontSize: 13, color: '#666', lineHeight: 18 },
  discStats: { flexDirection: 'row', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 16 },
  discStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  discStatIcon: { fontSize: 14 },
  discStatText: { fontSize: 12, color: '#666' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalClose: { fontSize: 20, color: '#999' },
  postInput: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', minHeight: 100, textAlignVertical: 'top' },
  mediaSelector: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 14 },
  mediaOption: { alignItems: 'center', padding: 10 },
  mediaOptionIcon: { fontSize: 26, marginBottom: 4 },
  mediaOptionText: { fontSize: 11, color: '#666' },
  postOptions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  districtPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  districtPickerIcon: { fontSize: 13, marginRight: 6 },
  districtPickerText: { fontSize: 13, color: '#1976D2' },
  anonToggle: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  anonToggleText: { fontSize: 12, color: '#666' },
  submitPost: { backgroundColor: '#FF6B35', borderRadius: 24, padding: 15, alignItems: 'center' },
  submitPostText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default InfoScreen;
