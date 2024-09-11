import {Animated, Easing, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {useEffect, useMemo, useRef} from 'react';

import {Color} from './types';

const baseStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'flex-end',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '200%',
  },
  contentContainer: {},
});

type UseStylesOptions = {
  style: StyleProp<ViewStyle> | undefined;
  width: number | undefined;
  useNativeDriver: boolean;
  duration: number;
  colors: Color[];
};

const animationStartOffsetX = 0;
const animationEndOffsetX = 0;

export const useStyles = ({useNativeDriver, width, ...options}: UseStylesOptions) => {
  const translateX = useRef(
    new Animated.Value(animationStartOffsetX, {useNativeDriver}),
  ).current;

  const duration = options.duration * options.colors.length * 2;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: width ?? 0 - animationEndOffsetX,
          duration,
          useNativeDriver,
          easing: Easing.linear,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [translateX, width, useNativeDriver, duration]);

  const colors = useMemo(() => {
    const arr = [...options.colors, ...options.colors];
    if (options.colors[0]) {
      arr.push(options.colors[0]);
    }
    return arr;
  }, [options.colors]);

  return {
    styles: {
      ...baseStyles,
      container: [baseStyles.container, options.style],
      gradient: [baseStyles.gradient, {transform: [{translateX}]}],
      custom: {
        colors,
      },
    },
  };
};
