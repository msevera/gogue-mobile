const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const IS_STAGING = process.env.APP_VARIANT === 'staging';
const id = 'ai.gogue';

export const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return `${id}.dev`;
  }

  if (IS_PREVIEW) {
    return `${id}.preview`;
  }

  if (IS_STAGING) {
    return `${id}.staging`
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
    return 'Gogue (Dev)';
  }

  if (IS_PREVIEW) {
    return 'Gogue (Preview)';
  }

  if (IS_STAGING) {
    return 'Gogue (Preview)'
  }

  return 'Gogue';
};

export default {
  "expo": {
    "name": getAppName(),
    "slug": "gogue",
    "owner": "msevera",
    "version": "1.0.1",
    "orientation": "portrait",
    "icon": "./assets/images/ios-light.png",
    "scheme": "gogue",
    "userInterfaceStyle": "automatic",   
    "ios": {
      "associatedDomains": ["applinks:gogue.ai", "applinks:www.gogue.ai"],
      "supportsTablet": false,
      "bundleIdentifier": getUniqueIdentifier('ios'),
      "googleServicesFile": process.env.GOOGLE_SERVICE_INFO_PLIST ?? "./GoogleService-Info.plist",
      "infoPlist": {  
        "ITSAppUsesNonExemptEncryption": false,
        "NSMicrophoneUsageDescription": "This app uses the microphone to capture your voice when you speak to the AI voice assistant.",       
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": [
              "gogue"
            ]
          }
        ],
        "UIBackgroundModes": ["audio"],
        "bitcode": false
      },
      "icon": {
        "dark": "./assets/images/ios-dark.png",
        "light": "./assets/images/ios-light.png",
        "tinted": "./assets/images/ios-tinted.png"
      }
    },
    "android": {
      "edgeToEdgeEnabled": true,
      "package": getUniqueIdentifier('android'), "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png", "backgroundColor": "#ffffff"
      }, "googleServicesFile": process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    "web": {
      "bundler": "metro", "output": "static", "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "./plugins/deepLinkSubscriber/withDeepLinkSubscriber.js",
      "expo-localization",
      "expo-web-browser",
      "expo-font",
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.gogue"
        }
      ],
      [
        "expo-build-properties", {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "expo-speech-recognition",
        {
          "microphonePermission": `This app uses the microphone to capture your voice when you speak to the AI voice assistant.`
        }
      ],
      [
        "onesignal-expo-plugin",
        {
          mode: getOneSignalEnv(),
        }
      ],
      [
        "@daily-co/config-plugin-rn-daily-js",
        {
          "enableCamera": false,
          "enableMicrophone": true,
          "enableScreenShare": false
        }
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#ffffff",
          "image": "./assets/images/splash-icon-blue.png",
          "dark": {
            "backgroundColor": "#343434",
            "image": "./assets/images/splash-icon-white.png"
          },
          "imageWidth": 200
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "eas": {
        "projectId": "5591aa61-bb06-4cc8-a11f-9310446d5652"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/5591aa61-bb06-4cc8-a11f-9310446d5652",
      "checkAutomatically": "NEVER"
    }
  }
}
