import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CartScreen = (props) => {
  const { cartItems = [], onBack, onCheckout, onRemoveItem } = props;

  const totalPrice = cartItems.reduce((sum, item) => {
    const num = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  // ── Empty cart state ──
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Feather name="shopping-cart" size={48} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Swipe right on products you love to add them here
          </Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={onBack}>
            <Text style={styles.emptyBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({cartItems.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {cartItems.map((item, i) => (
          <View key={i} style={styles.cartCard}>
            <View style={styles.cardTop}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>{item.desc}</Text>
                <View style={styles.vendorRow}>
                  <View style={styles.vendorLogo}>
                    <Text style={{color: '#fff', fontSize: 5}}>TASTY</Text>
                  </View>
                  <Text style={styles.vendorName}>{item.store || 'Tasty Bites'}</Text>
                  <Feather name="check-circle" size={12} color="#3B82F6" />
                </View>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.trashBtn}
                  onPress={() => onRemoveItem && onRemoveItem(i)}
                >
                  <Feather name="trash-2" size={20} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkoutBtnSmall} onPress={onCheckout}>
                  <Text style={styles.checkoutBtnSmallText}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Area */}
      <View style={styles.footer}>
        <View style={styles.footerTotalsRow}>
          <Text style={styles.totalItemsText}>Total Items: {cartItems.length}</Text>
          <Text style={styles.totalPriceText}>₦{totalPrice.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.proceedBtn} onPress={onCheckout}>
          <Text style={styles.proceedBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20,
  },

  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  emptyBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Cart card ──
  cartCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  vendorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 4,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashBtn: {
    padding: 8,
    marginRight: 8,
  },
  checkoutBtnSmall: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutBtnSmallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Footer ──
  footer: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerTotalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalItemsText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  proceedBtn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  proceedBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CartScreen;
