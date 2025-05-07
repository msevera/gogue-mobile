const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const id = 'ai.learnbud';

export const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return `${id}.dev`;
  }

  if (IS_PREVIEW) {
    return `${id}.preview`;
  }

  return id;
};

const getOneSignalEnv = () => {
  if (IS_DEV || IS_PREVIEW) {
    return `development`;
  }

  return 'production';
}

const getAppName = () => {
  if (IS_DEV) {
    return 'Learnbud (Dev)';
  }

  if (IS_PREVIEW) {
    return 'Learnbud (Preview)';
  }

  return 'Learnbud';
};

export default {
  "expo": {
    "name": getAppName(),
    "slug": "learnbud",
    "owner": "msevera",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "learnbud",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png", "resizeMode": "contain", "backgroundColor": "#ffffff"
    },
    "ios": {
      "associatedDomains": ["applinks:learnbud.ai"],
      "supportsTablet": false,
      "bundleIdentifier": getUniqueIdentifier('ios'),
      "googleServicesFile": process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist",
      "infoPlist": {
        "NSMicrophoneUsageDescription": "This app uses the microphone to record audio.",
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": [
              "learnbud"
            ]
          }
        ],
        "UIBackgroundModes": ["voip"],
        "bitcode": false
      },
    },
    "android": {
      "package": getUniqueIdentifier('android'), "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png", "backgroundColor": "#ffffff"
      }, "googleServicesFile": process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    "web": {
      "bundler": "metro", "output": "static", "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-font",
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.learnbud"
        }
      ],
      ["expo-build-properties", {
        "ios": {
          "useFrameworks": "static"
        }
      }],
      [
        "expo-speech-recognition",
        {
          "microphonePermission": `Allow ${getAppName()} to use the microphone.`,
          "speechRecognitionPermission": `Allow ${getAppName()} to use speech recognition.`,
          "androidSpeechServicePackages": ["com.google.android.googlequicksearchbox"]
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": `Allow ${getAppName()} to use your location.`
        }
      ],
      [
        "onesignal-expo-plugin",
        {
          mode: getOneSignalEnv(),
        }
      ],
      "@config-plugins/react-native-webrtc",
      "@daily-co/config-plugin-rn-daily-js",
      // [
      //   "expo-build-properties",
      //   {
      //     "android": {
      //       "minSdkVersion": 24
      //     },
      //     "ios": {
      //       "deploymentTarget": "13.4"
      //     }
      //   }
      // ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "3a6a9f25-5952-40c7-8336-a01bfc9e845f"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/ccb0ef83-03a4-4bbd-93d8-651084204613"
    }
  }
}
