
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import TourItem from "./components/TourItem";
import { Tour, groupByCity } from "./utils/tour";

const API_URL =
  "https://6ac49ded54a61668c5f5d99d.mockapi.io/tours";

function MainScreen() {
  const [keyword, setKeyword] = useState("");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // GET danh sách tour từ MockAPI
  const fetchTours = useCallback(async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách tour");
      }

      const data: Tour[] = await response.json();
      setTours(data);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không tải được dữ liệu. Hãy kiểm tra kết nối và API_URL."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Tải dữ liệu khi mở ứng dụng
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Kéo xuống để làm mới
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTours();
  }, [fetchTours]);

  // Lọc tour theo tên, không phân biệt hoa thường
  const filteredTours = useMemo(() => {
    const searchText = keyword.trim().toLocaleLowerCase("vi");

    if (!searchText) {
      return tours;
    }

    return tours.filter((tour) =>
      tour.name.toLocaleLowerCase("vi").includes(searchText)
    );
  }, [tours, keyword]);

  // Nhóm tour theo thành phố
  const sections = useMemo(
    () => groupByCity(filteredTours),
    [filteredTours]
  );

  // Danh sách yêu thích không bị ảnh hưởng bởi tìm kiếm
  const favorites = useMemo(
    () => tours.filter((tour) => tour.isFavorite),
    [tours]
  );

  // Xem chi tiết tour
  const handlePress = useCallback((tour: Tour) => {
    Alert.alert(
      tour.name,
      `Ngày khởi hành: ${tour.departure}\n` +
        `Số ngày: ${tour.days} ngày\n` +
        `Giá: ${tour.price.toLocaleString("vi-VN")} ₫`
    );
  }, []);

  // Cập nhật yêu thích bằng PUT, có hoàn tác khi lỗi
  const handleToggleFavorite = useCallback(
    async (id: string, next: boolean) => {
      const previous = tours.find((tour) => tour.id === id);

      if (!previous || previous.isFavorite === next) {
        return;
      }

      // Cập nhật giao diện ngay lập tức
      setTours((prev) =>
        prev.map((tour) =>
          tour.id === id
            ? { ...tour, isFavorite: next }
            : tour
        )
      );

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFavorite: next,
          }),
        });

        if (!response.ok) {
          throw new Error("PUT thất bại");
        }
      } catch (error) {
        // Hoàn tác nếu API lỗi
        setTours((prev) =>
          prev.map((tour) =>
            tour.id === id
              ? {
                  ...tour,
                  isFavorite: previous.isFavorite,
                }
              : tour
          )
        );

        Alert.alert(
          "Lỗi cập nhật",
          "Không thể cập nhật yêu thích. Vui lòng thử lại."
        );
      }
    },
    [tours]
  );

  // Header danh sách yêu thích
  const renderFavorites = () => (
    <View style={styles.favoriteSection}>
      <Text style={styles.favoriteTitle}>
        Tour yêu thích ({favorites.length})
      </Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyFavorite}>
          Chưa có tour yêu thích
        </Text>
      ) : (
        <FlatList
          horizontal
          data={favorites}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ width: 12 }} />
          )}
          contentContainerStyle={styles.favoriteList}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact
              onPress={handlePress}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header ứng dụng */}
      <View style={styles.header}>
        <Text style={styles.title}>Tour Việt</Text>

        <Text style={styles.student}>
          23728991 - Lê Khắc Huy
        </Text>

        <TextInput
          style={styles.search}
          placeholder="Tìm tour theo tên..."
          value={keyword}
          onChangeText={setKeyword}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Danh sách tour */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>
            Đang tải danh sách tour...
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          ListHeaderComponent={renderFavorites}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
            />
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {section.title} · {section.data.length} tour
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              onPress={handlePress}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {keyword.trim()
                ? "Không tìm thấy tour phù hợp"
                : "Chưa có dữ liệu tour"}
            </Text>
          }
          contentContainerStyle={
            sections.length === 0
              ? styles.emptyContent
              : undefined
          }
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563EB",
  },
  student: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
  search: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    fontSize: 16,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#64748B",
  },
  sectionHeader: {
    backgroundColor: "#DBEAFE",
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D4ED8",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 20,
    color: "#64748B",
  },
  emptyContent: {
    flexGrow: 1,
  },
  favoriteSection: {
    paddingVertical: 12,
    paddingLeft: 12,
    backgroundColor: "#F8FAFC",
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  favoriteList: {
    paddingRight: 12,
  },
  emptyFavorite: {
    color: "#64748B",
    paddingVertical: 12,
  },
});
