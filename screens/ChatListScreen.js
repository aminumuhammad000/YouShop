import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { fetchChats } from '../services/api';

const ChatListScreen = ({ onOpenChat, onOpenSearch }) => {
  const [tab, setTab] = useState('All');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats();
        setChats(data);
      } catch (error) {
        console.log('Failed to fetch chats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadChats();
  }, []);

  const filteredChats = tab === 'All' ? chats : tab === 'Unread' ? chats.filter(c => c.unread > 0) : chats;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Feather name="chevron-left" size={24} color="#1F2937" /></TouchableOpacity>
        <Text style={styles.title}>Chats</Text>
        <TouchableOpacity onPress={onOpenSearch}><Feather name="search" size={22} color="#1F2937" /></TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['All', 'Unread', 'Pinned'].map(t => (
          <TouchableOpacity 
            key={t} 
            style={[styles.tabBtn, tab === t ? styles.tabActive : styles.tabInactive]} 
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredChats.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Feather name="message-circle" size={48} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', marginTop: 16, fontSize: 16 }}>No chats yet</Text>
          </View>
        ) : (
          filteredChats.map(c => (
            <TouchableOpacity key={c._id || c.id} style={styles.row} onPress={() => onOpenChat(c)}>
              <View style={[styles.avatar, { backgroundColor: c.avatarColor || '#1F2937' }]}>
                <Feather name="user" size={24} color="#fff" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.msg} numberOfLines={2}>{c.lastMessage || c.msg}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.time}>{c.time || ''}</Text>
                {c.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeTxt}>{c.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
  tabBtn: { 
    paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, 
    borderWidth: 1 
  },
  tabActive: { backgroundColor: '#EDE9FE', borderColor: '#EDE9FE' },
  tabInactive: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
  tabTxt: { color: '#8B5CF6', fontSize: 14, fontWeight: '500' },
  tabTxtActive: { color: '#6D28D9', fontWeight: '600' },
  row: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', 
    paddingHorizontal: 20, paddingVertical: 14 
  },
  avatar: { 
    width: 56, height: 56, borderRadius: 28, 
    alignItems: 'center', justifyContent: 'center', marginRight: 16 
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  msg: { fontSize: 13, color: '#9CA3AF', lineHeight: 18 },
  right: { alignItems: 'flex-end', justifyContent: 'flex-start', marginLeft: 10, minWidth: 45, paddingTop: 4, height: '100%' },
  time: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },
  badge: { 
    width: 24, height: 24, borderRadius: 12, 
    backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' 
  },
  badgeTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

export default ChatListScreen;
