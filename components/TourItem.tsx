
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Tour,
  formatDate,
  getSeatLabel,
} from "../utils/tour";

export type TourItemProps = {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
};

function TourItem({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}: TourItemProps) {
  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      {/* Ảnh tour */}
      <View
        style={[
          styles.imageBox,
          compact && styles.compactImageBox,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onPress(tour)}
        >
          <Image
            source={{ uri: tour.image }}
            style={[
              styles.image,
              compact && styles.compactImage,
            ]}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Nút tim nằm trên ảnh khi compact */}
        {compact && (
          <TouchableOpacity
            testID="fav-btn"
            accessibilityRole="button"
            onPress={() =>
              onToggleFavorite(tour.id, !tour.isFavorite)
            }
            style={[
              styles.heartButton,
              styles.compactHeart,
            ]}
          >
            <Text style={styles.heart}>
              {tour.isFavorite ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Thông tin tour */}
      <TouchableOpacity
        style={[styles.info, compact && styles.compactInfo]}
        activeOpacity={0.85}
        onPress={() => onPress(tour)}
      >
        <Text
          style={styles.name}
          numberOfLines={compact ? 1 : 2}
        >
          {tour.name}
        </Text>

        {!compact && (
          <>
            <Text style={styles.city}>
              {tour.city}
            </Text>

            <Text style={styles.date}>
              📅 {formatDate(tour.departure)} · {tour.days} ngày
            </Text>
          </>
        )}

        <Text style={styles.price}>
          {tour.price.toLocaleString("vi-VN")} ₫
        </Text>

        {!compact && (
          <Text
            style={[
              styles.seats,
              tour.seats <= 3 && styles.lowSeats,
            ]}
          >
            {getSeatLabel(tour.seats)}
          </Text>
        )}
      </TouchableOpacity>

      {/* Nút tim ở mép phải khi không compact */}
      {!compact && (
        <TouchableOpacity
          testID="fav-btn"
          accessibilityRole="button"
          onPress={() =>
            onToggleFavorite(tour.id, !tour.isFavorite)
          }
          style={styles.heartButton}
        >
          <Text style={styles.heart}>
            {tour.isFavorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },

  imageBox: {
    width: 90,
    height: 90,
    position: "relative",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B",
  },

  city: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  date: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
  },

  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EA580C",
    marginTop: 5,
  },

  seats: {
    fontSize: 12,
    color: "#15803D",
    marginTop: 4,
  },

  lowSeats: {
    color: "#DC2626",
    fontWeight: "bold",
  },

  heartButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },

  heart: {
    fontSize: 26,
    color: "#E11D48",
  },

  // Thẻ compact
  compactCard: {
    width: 160,
    flexDirection: "column",
    alignItems: "stretch",
    padding: 8,
    marginHorizontal: 0,
  },

  compactImageBox: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
  },

  compactImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  compactInfo: {
    marginLeft: 0,
    marginTop: 8,
  },

  compactHeart: {
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginLeft: 0,
  },
});

export default React.memo(TourItem);
