import { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import { useGalleryStore } from "@/store/gallery-store";
import { Camera } from "lucide-react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const { setPermissionGranted, setPhotos } = useGalleryStore();

  useEffect(() => {
    async function getPermissions() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === "granted") {
        setPermissionGranted(true);
        
        // Fetch photos if permission is granted
        if (Platform.OS !== "web") {
          const media = await MediaLibrary.getAssetsAsync({
            mediaType: "photo",
            sortBy: [MediaLibrary.SortBy.creationTime],
          });
          setPhotos(media.assets);
        }
      } else {
        setPermissionGranted(false);
      }
    }

    getPermissions();
  }, []);

  const handleEnterGallery = () => {
    router.push("/gallery");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#f8f9fa", "#e9ecef"]}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Camera size={64} color="#4361ee" />
        </View>
        
        <Text style={styles.title}>MyGallery</Text>
        <Text style={styles.subtitle}>made by nirjhar</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleEnterGallery}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>View Gallery</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e9ecef",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4361ee",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});