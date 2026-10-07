import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { fetchChatById, sendChatMessage } from '../services/api';

const ChatScreen = ({ chat, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatId = chat._id || chat.id;
        if (chatId) {
          const data = await fetchChatById(chatId);
          setChatMessages(data.messages || []);
        }
      } catch (error) {
        console.log('Failed to load messages:', error);
        // Fallback: use messages from the chat object passed in
        if (chat.messages) {
          setChatMessages(chat.messages);
        }
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [chat]);

  const handleSend = async () => {
    if (inputText.trim()) {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const timeStr = `${hours}:${minutes} ${ampm}`;

      const newMsg = {
        id: chatMessages.length + 1,
        fromMe: true,
        text: inputText.trim(),
        time: timeStr,
      };
      setChatMessages([...chatMessages, newMsg]);
      setInputText('');

      // Send to server
      try {
        const chatId = chat._id || chat.id;
        if (chatId) {
          await sendChatMessage(chatId, newMsg.text, true);
        }
      } catch (error) {
        console.log('Failed to send message to server:', error);
      }
    } else {
      console.log('Voice message action');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header (Purple Background) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Feather name="user" size={20} color="#fff" />
        </View>
        <Text style={styles.name}>{chat.name}</Text>
      </View>

      {/* Main Chat Area (White rounded top) */}
      <View style={styles.chatArea}>
        {/* Date Divider (Overlaps the border) */}
        <View style={styles.dateDividerWrapper}>
          <View style={styles.dateDivider}>
            <Text style={styles.dateText}>Today</Text>
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
            {chatMessages.map(m => (
              <View key={m.id || m._id || Math.random()} style={styles.messageRow}>
                {m.isVoice ? (
                  <View style={styles.voiceWrap}>
                    <View style={styles.voiceBubble}>
                      <View style={styles.waveform}>
                        {[14,24,18,28,16,26,20,32,14,26,22,30,16,24,18].map((h,i) => (
                          <View key={i} style={[styles.bar, {height: h, backgroundColor: i < 8 ? '#8B5CF6' : '#C4B5FD'}]} />
                        ))}
                      </View>
                      <Text style={styles.voiceDuration}>{m.duration}</Text>
                      <TouchableOpacity style={styles.playBtn}>
                        <Feather name="play" size={16} color="#fff" style={{marginLeft: 2}} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.timeLeft}>{m.time}</Text>
                  </View>
                ) : (
                  <View style={[styles.bubbleWrap, m.fromMe ? styles.alignRight : styles.alignLeft]}>
                    <View style={[styles.bubble, m.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                      <Text style={[styles.bubbleTxt, m.fromMe ? styles.txtMe : styles.txtThem]}>{m.text}</Text>
                    </View>
                    <Text style={[styles.time, m.fromMe ? styles.timeRight : styles.timeLeft]}>{m.time}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Input Bar Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            {/* Upload Buttons */}
            <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
              <Feather name="paperclip" size={20} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
              <Feather name="image" size={20} color="#8B5CF6" />
            </TouchableOpacity>
            
            {/* Input Pill */}
            <View style={styles.inputPill}>
              <TextInput 
                placeholder="Message..." 
                placeholderTextColor="#9CA3AF" 
                value={inputText}
                onChangeText={setInputText}
                style={styles.input} 
              />
            </View>
            
            {/* Action button (Voice or Send) */}
            <TouchableOpacity style={styles.actionBtn} onPress={handleSend} activeOpacity={0.8}>
              <Feather name={inputText.trim() ? "send" : "mic"} size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBE5F7' }, // Very light purple background for top header area
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 
  },
  backBtn: { marginRight: 12 },
  avatar: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center', 
    marginRight: 12 
  },
  name: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  
  chatArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    position: 'relative',
    marginTop: -20, // Pulls the white card up slightly
  },
  dateDividerWrapper: {
    alignItems: 'center',
    marginTop: -14, // Pulls the pill up so it overlaps the border
    marginBottom: 10,
    zIndex: 10,
  },
  dateDivider: { 
    backgroundColor: '#EBE5F7', 
    borderRadius: 16, 
    paddingHorizontal: 20, 
    paddingVertical: 6,
  },
  dateText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  
  messages: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  messageRow: { marginBottom: 16 },
  bubbleWrap: { maxWidth: '80%' },
  alignRight: { alignSelf: 'flex-end' },
  alignLeft: { alignSelf: 'flex-start' },
  
  bubble: { 
    borderRadius: 24, 
    paddingHorizontal: 20, 
    paddingVertical: 14,
  },
  bubbleMe: { 
    backgroundColor: '#8B5CF6', 
    borderBottomRightRadius: 6 
  },
  bubbleThem: { 
    backgroundColor: '#F3E8FF', // Light purple for received text
    borderBottomLeftRadius: 6 
  },
  bubbleTxt: { fontSize: 15, lineHeight: 22 },
  txtMe: { color: '#fff' },
  txtThem: { color: '#4C1D95' }, // Darker purple text for contrast
  
  time: { fontSize: 12, marginTop: 6 },
  timeRight: { color: '#9CA3AF', textAlign: 'right' },
  timeLeft: { color: '#9CA3AF', textAlign: 'left', marginLeft: 4 },
  
  voiceWrap: { alignSelf: 'flex-start', maxWidth: '80%' },
  voiceBubble: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F3E8FF', // Light purple for voice bubble too
    borderRadius: 24, borderBottomLeftRadius: 6, 
    paddingHorizontal: 16, paddingVertical: 12, gap: 10 
  },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 36 },
  bar: { width: 3, borderRadius: 2 },
  voiceDuration: { color: '#4C1D95', fontSize: 14, fontWeight: '500' },
  playBtn: { 
    width: 36, height: 36, borderRadius: 18, 
    backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', 
  },
  
  inputArea: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    borderRadius: 24, 
    paddingHorizontal: 12, 
    paddingVertical: 8,
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#1F2937', 
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  actionBtn: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' 
  },
});

export default ChatScreen;
