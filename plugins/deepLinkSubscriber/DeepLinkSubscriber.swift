import ExpoModulesCore
import segment_analytics_react_native

public class DeepLinkSubscriber: ExpoAppDelegateSubscriber {
  public override func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any]
  ) -> Bool {
    AnalyticsReactNative.trackDeepLink(url: url as NSURL, options: options)
    return false
  }
}
