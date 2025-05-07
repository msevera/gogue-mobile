import { createContext, useState } from "react";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

type BottomSheetInternalContextType = {
  animatedScrollableLockedState: SharedValue<boolean>
  animatedScrollableContentOffsetY: SharedValue<boolean>
  nativeGesture: typeof Gesture,
  scrollContext: SharedValue<{
    scrollDirection: number,
    isScrollBeginning: boolean,
    scrollLocked: boolean
  }>
}

export const BottomSheetInternalContext = createContext<BottomSheetInternalContextType | null>(null);

export const BottomSheetInternalProvider = BottomSheetInternalContext.Provider;
