import 'dotenv/config';

export default {
  expo: {
    name: "SilentApp",
    slug: "SilentApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "This app needs access to your camera to upload item images.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photo library to choose item images."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.anonymous.SilentApp",
      permissions: ["CAMERA", "MEDIA_LIBRARY"],
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      API_URL: process.env.API_URL,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL
    }
  }
};
