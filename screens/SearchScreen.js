import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const suggestions = [
  'Chilled Zobo', 'Funiture Store', 'Wedding Event Centers',
  'Automobile Repair Center', 'Spicy Awara',
  'Provision Store Near Me', 'Home Decor',
];
const history = ['Birthday cakes near me', 'Pharmacy', 'Hair saloon', 'Kunun Aya'];

const SearchScreen = ({ onBack }) => (
  <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Feather name="chevron-left" size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text style={styles.title}>Search</Text>
      <View style={{ width: 40 }} />
    </View>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <Text style={styles.searchPlaceholder}>Search products...</Text>
      </View>

      {/* Suggestions */}
      <Text style={styles.sectionTitle}>Suggestions</Text>
      <View style={styles.tagsWrap}>
        {suggestions.map((s, i) => (
          <TouchableOpacity key={i} style={styles.tag}>
            <Text style={styles.tagTxt}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* History */}
      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>History</Text>
        <TouchableOpacity><Text style={styles.clearAll}>Clear all</Text></TouchableOpacity>
      </View>
      {history.map((h, i) => (
        <View key={i} style={styles.historyRow}>
          <Feather name="clock" size={18} color="#1F2937" style={{ marginRight: 12 }} />
          <Text style={styles.historyTxt}>{h}</Text>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <Feather name="x" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5FA', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#1F2937' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20, marginTop: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchPlaceholder: { color: '#9CA3AF', fontSize: 15, marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  tag: { backgroundColor: '#EDE9FE', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 14, margin: 4 },
  tagTxt: { color: '#6D28D9', fontSize: 13, fontWeight: '500' },
  historyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  clearAll: { color: '#9CA3AF', fontSize: 14 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  historyTxt: { color: '#1F2937', fontSize: 15 },
});

export default SearchScreen;
