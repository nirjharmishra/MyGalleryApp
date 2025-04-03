import { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator,
  Platform,
  RefreshControl
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import { useGalleryStore } from "@/store/gallery-store";
import { ImageOff, RefreshCcw } from "lucide-react-native";

const { width } = Dimensions.get("window");
const numColumns = 3;
const tileSize = width / numColumns;
const gap = 2;

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, permissionGranted, setPhotos } = useGalleryStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (photos.length > 0) {
      setLoading(false);
    } else if (permissionGranted && Platform.OS !== "web") {
      loadPhotos();
    } else {
      setLoading(false);
    }
  }, [permissionGranted]);

  const loadPhotos = async () => {
    try {
      if (Platform.OS !== "web") {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: "photo",
          sortBy: [MediaLibrary.SortBy.creationTime],
          first: 200,
        });
        setPhotos(media.assets);
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
  };

  const handlePhotoPress = (id: string) => {
    router.push(`/photo/${id}`);
  };

  if (!permissionGranted && Platform.OS !== "web") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ImageOff size={64} color="#6c757d" />
          <Text style={styles.emptyText}>Permission to access photos was denied</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.refreshButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361ee" />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (photos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ImageOff size={64} color="#6c757d" />
          <Text style={styles.emptyText}>No photos found</Text>
          {Platform.OS !== "web" && (
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <RefreshCcw size={16} color="white" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={() => handlePhotoPress(item.id)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        )}
        refreshControl={
          Platform.OS !== "web" ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4361ee"]}
              tintColor="#4361ee"
            />
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  tile: {
    width: tileSize - gap * 2,
    height: tileSize - gap * 2,
    margin: gap,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e9ecef",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6c757d",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4361ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});