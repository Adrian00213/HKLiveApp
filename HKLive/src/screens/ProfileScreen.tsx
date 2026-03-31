import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../i18n/useTranslation';

const ProfileScreen: React.FC = () => {
  const { t, selectedLanguage, getLanguageName } = useTranslation();
  const { user, setSelectedLanguage } = useAppStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const languages: Array<{ key: 'zh-TW' | 'zh-CN' | 'en'; flag: string }> = [
    { key: 'zh-TW', flag: '🇭🇰' },
    { key: 'zh-CN', flag: '🇨🇳' },
    { key: 'en', flag: '🇺🇸' },
  ];

  const menuItems = [
    { icon: '❤️', label: t('myFavorites'), value: '12', color: '#FF6B35' },
    { icon: '💬', label: t('myComments'), value: '28', color: '#1976D2' },
    { icon: '📝', label: t('myPosts'), value: '5', color: '#4CAF50' },
    { icon: '🎤', label: '語音記錄', value: '3', color: '#9C27B0' },
  ];

  const settingsItems = [
    { icon: '🔔', label: t('notifications'), hasSwitch: true, value: true },
    { icon: '📍', label: '位置分享', hasSwitch: true, value: false },
    { icon: '🌐', label: t('language'), hasArrow: true },
    { icon: '🎨', label: '外觀主題', hasArrow: true },
    { icon: '🔒', label: '私隱設定', hasArrow: true },
    { icon: 'ℹ️', label: t('about'), hasArrow: true },
  ];

  const handleLanguageChange = (lang: 'zh-TW' | 'zh-CN' | 'en') => {
    setSelectedLanguage(lang);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('請輸入', '請填寫電郵和密碼');
      return;
    }
    
    if (!isLogin && !name) {
      Alert.alert('請輸入', '請填寫名稱');
      return;
    }

    // For demo - in production, connect to Firebase Auth
    Alert.alert(
      '功能準備中', 
      'Firebase 登入功能即將開放。現時為展示模式。',
      [{ text: 'OK' }]
    );
    setShowLoginModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card - show login if not authenticated */}
        <TouchableOpacity 
          style={styles.userCard}
          onPress={() => setShowLoginModal(true)}
        >
          <View style={styles.userMain}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👤</Text>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>⭐</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>點擊登入 / 註冊</Text>
              <Text style={styles.userEmail}>登入以使用個人化功能</Text>
            </View>
          </View>
          <View style={styles.loginArrow}>
            <Text style={styles.loginArrowText}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {menuItems.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: item.color + '15' }]}>
                <Text style={styles.statEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的動態</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>❤️</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>收藏了「MIRROR演唱會」</Text>
                <Text style={styles.activityTime}>2小時前</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>💬</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>在「廟街夜市」留言</Text>
                <Text style={styles.activityTime}>5小時前</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>📍</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>舉報了「窩打老道交通意外」</Text>
                <Text style={styles.activityTime}>昨日</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <View style={styles.languageContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.key}
                style={[
                  styles.languageOption,
                  selectedLanguage === lang.key && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.key)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang.key && styles.languageTextActive,
                  ]}
                >
                  {getLanguageName(lang.key)}
                </Text>
                {selectedLanguage === lang.key && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          <View style={styles.settingsContainer}>
            {settingsItems.map((item, index) => (
              <View key={index} style={styles.settingsItem}>
                <View style={styles.settingsLeft}>
                  <Text style={styles.settingsIcon}>{item.icon}</Text>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                </View>
                {item.hasSwitch && (
                  <Switch
                    value={item.value}
                    trackColor={{ false: '#E0E0E0', true: '#FF6B35' }}
                    thumbColor="#FFF"
                  />
                )}
                {item.hasArrow && <Text style={styles.settingsArrow}>›</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷功能</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>使用統計</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>💡</Text>
              <Text style={styles.quickActionText}>建議功能</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🏆</Text>
              <Text style={styles.quickActionText}>成就</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🎁</Text>
              <Text style={styles.quickActionText}>邀請好友</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.appLogo}>
            <Text style={styles.appLogoText}>HKLive</Text>
          </View>
          <Text style={styles.appVersion}>{t('version')} 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 HKLive</Text>
          <Text style={styles.appTagline}>「香港，一触即发」</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Login Modal */}
      <Modal visible={showLoginModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isLogin ? '🔑 登入' : '📝 註冊'}
              </Text>
              <TouchableOpacity onPress={() => setShowLoginModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>名稱</Text>
                <TextInput
                  style={styles.input}
                  placeholder="你叫咩名？"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>電郵</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>密碼</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
              <Text style={styles.authButtonText}>
                {isLogin ? '登入' : '建立帳戶'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchAuth}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchAuthText}>
                {isLogin 
                  ? '未有帳戶？立即註冊' 
                  : '已有帳戶？登入'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FF6B35' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  userCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  userMain: { flexDirection: 'row', flex: 1 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFE5DC', justifyContent: 'center', alignItems: 'center', marginRight: 14, position: 'relative' },
  avatarEmoji: { fontSize: 32 },
  avatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  avatarBadgeText: { fontSize: 12 },
  userInfo: { flex: 1, justifyContent: 'center' },
  userName: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#666' },
  loginArrow: { marginLeft: 10 },
  loginArrowText: { fontSize: 24, color: '#CCC' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12, paddingLeft: 4 },
  activityList: { backgroundColor: '#FFF', borderRadius: 16, padding: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  activityIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityEmoji: { fontSize: 18 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 14, color: '#333', marginBottom: 2 },
  activityTime: { fontSize: 12, color: '#999' },
  languageContainer: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  languageOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  languageOptionActive: { backgroundColor: '#FFF5F0' },
  languageFlag: { fontSize: 24, marginRight: 14 },
  languageText: { flex: 1, fontSize: 15, color: '#333' },
  languageTextActive: { color: '#FF6B35', fontWeight: '600' },
  checkmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center' },
  checkmarkText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  settingsContainer: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  settingsItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsIcon: { fontSize: 20, marginRight: 12 },
  settingsLabel: { fontSize: 15, color: '#333' },
  settingsArrow: { fontSize: 22, color: '#CCC' },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickAction: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 16, alignItems: 'center' },
  quickActionIcon: { fontSize: 28, marginBottom: 8 },
  quickActionText: { fontSize: 13, color: '#666' },
  appInfo: { alignItems: 'center', paddingVertical: 24 },
  appLogo: { backgroundColor: '#FF6B35', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginBottom: 10 },
  appLogoText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  appVersion: { fontSize: 13, color: '#999', marginBottom: 2 },
  appCopyright: { fontSize: 12, color: '#BBB', marginBottom: 6 },
  appTagline: { fontSize: 14, color: '#FF6B35', fontStyle: 'italic' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginTop: 8 },
  logoutIcon: { fontSize: 18, marginRight: 8 },
  logoutText: { fontSize: 15, color: '#F44336' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalClose: { fontSize: 22, color: '#999' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  authButton: { backgroundColor: '#FF6B35', borderRadius: 24, padding: 16, alignItems: 'center', marginTop: 8 },
  authButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  switchAuth: { marginTop: 16, alignItems: 'center' },
  switchAuthText: { fontSize: 14, color: '#1976D2' },
});

export default ProfileScreen;
