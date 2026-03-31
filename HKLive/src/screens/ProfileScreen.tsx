import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';

export default function ProfileScreen() {
  const { user, selectedLanguage, setSelectedLanguage } = useAppStore();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const languages = [
    { key: 'zh-TW', label: '🇭🇰 繁體中文' },
    { key: 'zh-CN', label: '🇨🇳 簡體中文' },
    { key: 'en', label: '🇺🇸 English' },
  ];

  const menuItems = [
    { icon: '❤️', label: '我的收藏', value: '12' },
    { icon: '💬', label: '我的留言', value: '28' },
    { icon: '📝', label: '我的帖子', value: '5' },
    { icon: '🎤', label: '語音記錄', value: '3' },
  ];

  const settingsItems = [
    { icon: '🔔', label: '通知', switch: true, value: true },
    { icon: '📍', label: '位置分享', switch: true, value: false },
    { icon: '🌐', label: '語言', arrow: true },
    { icon: '🎨', label: '主題', arrow: true },
    { icon: '🔒', label: '私隱設定', arrow: true },
    { icon: 'ℹ️', label: '關於', arrow: true },
  ];

  const quickActions = [
    { icon: '📊', label: '使用統計' },
    { icon: '💡', label: '建議功能' },
    { icon: '🏆', label: '成就' },
    { icon: '🎁', label: '邀請好友' },
  ];

  const handleLogin = () => {
    Alert.alert('功能準備中', 'Firebase 登入功能即將開放');
    setShowLogin(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <TouchableOpacity style={styles.userCard} onPress={() => setShowLogin(true)}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>點擊登入 / 註冊</Text>
            <Text style={styles.userEmail}>登入以使用個人化功能</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {menuItems.map((item, i) => (
            <View key={i} style={styles.statItem}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 語言</Text>
          <View style={styles.langContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.key}
                style={[styles.langOption, selectedLanguage === lang.key && styles.langOptionActive]}
                onPress={() => setSelectedLanguage(lang.key as any)}
              >
                <Text style={styles.langText}>{lang.label}</Text>
                {selectedLanguage === lang.key && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ 設定</Text>
          <View style={styles.settingsContainer}>
            {settingsItems.map((item, i) => (
              <View key={i} style={styles.settingItem}>
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.switch && (
                  <Switch value={item.value} trackColor={{ false: '#E0E0E0', true: '#FF6B35' }} thumbColor="#FFF" />
                )}
                {item.arrow && <Text style={styles.settingArrow}>›</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 快捷功能</Text>
          <View style={styles.quickContainer}>
            {quickActions.map((action, i) => (
              <TouchableOpacity key={i} style={styles.quickItem}>
                <Text style={styles.quickIcon}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <View style={styles.appLogo}>
            <Text style={styles.appLogoText}>HKLive</Text>
          </View>
          <Text style={styles.appVersion}>版本 1.0.0</Text>
          <Text style={styles.appTagline}>「香港，一触即发」</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 登出</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Login Modal */}
      <Modal visible={showLogin} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔑 登入 / 註冊</Text>
              <TouchableOpacity onPress={() => setShowLogin(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>名稱</Text>
              <TextInput style={styles.input} placeholder="你叫咩名？" placeholderTextColor="#999" value={name} onChangeText={setName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>電郵</Text>
              <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>密碼</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>登入</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchBtn}>
              <Text style={styles.switchBtnText}>未有帳戶？立即註冊</Text>
            </TouchableOpacity>
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
  content: { flex: 1, padding: 16 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16 },
  userAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFE5DC', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarEmoji: { fontSize: 28 },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#666' },
  arrow: { fontSize: 24, color: '#CCC' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statIcon: { width: 44, height: 44, backgroundColor: '#F5F5F5', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  langContainer: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  langOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  langOptionActive: { backgroundColor: '#FFF5F0' },
  langText: { flex: 1, fontSize: 15, color: '#333' },
  checkmark: { fontSize: 16, color: '#FF6B35', fontWeight: 'bold' },
  settingsContainer: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  settingIcon: { fontSize: 20, marginRight: 12 },
  settingLabel: { flex: 1, fontSize: 15, color: '#333' },
  settingArrow: { fontSize: 22, color: '#CCC' },
  quickContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 16, alignItems: 'center' },
  quickIcon: { fontSize: 28, marginBottom: 8 },
  quickLabel: { fontSize: 13, color: '#666' },
  appInfo: { alignItems: 'center', paddingVertical: 24 },
  appLogo: { backgroundColor: '#FF6B35', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginBottom: 10 },
  appLogoText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  appVersion: { fontSize: 13, color: '#999', marginBottom: 2 },
  appTagline: { fontSize: 14, color: '#FF6B35', fontStyle: 'italic' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginTop: 8 },
  logoutText: { fontSize: 15, color: '#F44336' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalClose: { fontSize: 22, color: '#999' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  loginBtn: { backgroundColor: '#FF6B35', borderRadius: 24, padding: 16, alignItems: 'center', marginTop: 8 },
  loginBtnText: { fontSize: 16, color: '#FFF', fontWeight: 'bold' },
  switchBtn: { marginTop: 16, alignItems: 'center' },
  switchBtnText: { fontSize: 14, color: '#1976D2' },
});
