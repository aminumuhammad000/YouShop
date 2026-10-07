import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const foodImage = require('../assets/spicy_awara_food.jpg');

const LikedPostsScreen = ({ onBack }) => {
  const posts = [1, 2]; // Render two dummy items based on the screenshot

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liked Posts</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Subheader */}
      <View style={styles.subheader}>
        <View style={styles.itemsBadge}>
          <Text style={styles.itemsText}>24 items</Text>
        </View>
        <TouchableOpacity style={styles.sortBtn}>
          <Feather name="bar-chart-2" size={18} color="#4B5563" style={{ transform: [{ rotate: '90deg' }] }} />
          <Text style={styles.sortText}>Sort by</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {posts.map((_, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={foodImage} style={styles.cardImage} />
              <TouchableOpacity style={styles.heartBtn}>
                <Feather name="heart" size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>Spicy Awara</Text>
                <Text style={styles.price}>₦1000</Text>
              </View>
              <Text style={styles.desc}>
                Hand-crafted minimalist ceramics for the modern home office or studio space.
              </Text>
              
              <View style={styles.footerRow}>
                <View style={styles.vendorInfo}>
                  <View style={styles.vendorLogo}>
                    <Text style={{color: '#fff', fontSize: 6}}>TASTY</Text>
                  </View>
                  <Text style={styles.vendorName}>Tasty Bites</Text>
                  <Feather name="check-circle" size={12} color="#3B82F6" />
                </View>
                <TouchableOpacity>
                  <Text style={styles.viewItemText}>View Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  itemsBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  itemsText: {
    color: '#6D28D9',
    fontWeight: '700',
    fontSize: 13,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // Card
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBody: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  desc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  vendorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 4,
  },
  viewItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
});

export default LikedPostsScreen;
