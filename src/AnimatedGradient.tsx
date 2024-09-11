import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import {Color, Point} from './types';
import {FC, PropsWithChildren} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useStyles} from './AnimatedGradient.styles';
import {useViewSizeDetector} from './useViewSizeDetector';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedGradientProps = {
  style?: StyleProp<ViewStyle>;
  colors: Color[];
  speed: number;
  useNativeDriver?: boolean;
  start: Point;
  end: Point;
};

const start = {x: 1, y: 0.5};
const end = {x: 0, y: 0.5};

export const AnimatedGradient: FC<PropsWithChildren<AnimatedGradientProps>> = ({
  useNativeDriver = true,
  children,
  ...props
}) => {
  const {size, onLayout} = useViewSizeDetector();
  const {styles} = useStyles({
    style: props.style,
    colors: props.colors,
    useNativeDriver,
    width: size?.width,
    duration: props.speed,
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <AnimatedLinearGradient
        style={styles.gradient}
        start={start}
        end={end}
        colors={styles.custom.colors}
      />
      {children && <View style={styles.contentContainer} children={children} />}
    </View>
  );
};
