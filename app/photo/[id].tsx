import { useEffect, useState } from "react";
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  Dimensions, 
  TouchableOpacity,
  Share,
  Platform
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import { useGalleryStore } from "@/store/gallery-store";
import { Download, Share2 } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams();
  const { photos } = useGalleryStore();
  const [photo, setPhoto] = useState<MediaLibrary.Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPhoto = photos.find(p => p.id === id);
    if (foundPhoto) {
      setPhoto(foundPhoto);
      setLoading(false);
    } else if (Platform.OS !== "web") {
      // If not found in store, try to fetch it directly
      fetchPhoto();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchPhoto = async () => {
    try {
      if (Platform.OS !== "web" && id) {
        const asset = await MediaLibrary.getAssetInfoAsync(id.toString());
        setPhoto(asset);
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (photo && Platform.OS !== "web") {
      try {
        await Share.share({
          url: photo.uri,
        });
      } catch (error) {
        console.error("Error sharing photo:", error);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4361ee" />
        </View>
      </SafeAreaView>
    );
  }

  if (!photo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13" }}
            style={styles.errorImage}
            contentFit="contain"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.image}
          contentFit="contain"
          transition={300}
        />
      </View>

      {Platform.OS !== "web" && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={24} color="#4361ee" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width,
    height: height * 0.8,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorImage: {
    width: width * 0.7,
    height: width * 0.7,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});