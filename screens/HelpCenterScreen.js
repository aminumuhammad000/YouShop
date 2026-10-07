import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HelpCenterScreen = ({ onBack }) => {
  const popularQuestions = [
    'How do I return an item?',
    'Where is my order?',
    'Can I change my shipping address?',
    'What payment methods do you accept?',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Popular Questions Title */}
        <Text style={styles.sectionTitle}>Popular Questions</Text>

        {/* Questions List Card */}
        <View style={styles.questionsCard}>
          {popularQuestions.map((q, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.questionRow, 
                index !== popularQuestions.length - 1 && styles.questionRowBorder
              ]}
            >
              <Text style={styles.questionText}>{q}</Text>
              <Feather name="chevron-right" size={20} color="#4B5563" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Contact Card */}
        <View style={styles.supportCard}>
          {/* Subtle icon watermark in background (using absolute positioning) */}
          <Feather name="headphones" size={140} color="rgba(255,255,255,0.1)" style={styles.watermarkIcon} />
          
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportText}>
            Our team is available 24/7 to assist you with any concerns.
          </Text>
          
          <TouchableOpacity style={styles.chatBtn}>
            <Feather name="message-square" size={18} color="#6D28D9" />
            <Text style={styles.chatBtnText}>Chat with us</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.emailBtn}>
            <Feather name="mail" size={18} color="#fff" />
            <Text style={styles.emailBtnText}>Email Support</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  
  // Questions Card
  questionsCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: 24,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  questionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    paddingRight: 16,
    lineHeight: 24,
  },
  
  // Support Card
  supportCard: {
    backgroundColor: '#A78BFA', // Light purple
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkIcon: {
    position: 'absolute',
    right: -20,
    top: 20,
    transform: [{ rotate: '-15deg' }],
  },
  supportTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  supportText: {
    fontSize: 15,
    color: '#F5F3FF',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: '85%',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  chatBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6D28D9', // Dark purple text
    marginLeft: 8,
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6', // Solid darker purple
    paddingVertical: 14,
    borderRadius: 12,
  },
  emailBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default HelpCenterScreen;
