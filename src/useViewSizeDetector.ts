/** @format */

import {useCallback, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';

type Size = {width: number; height: number};

export const useViewSizeDetector = () => {
  const [size, setSize] = useState<Size>();

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: {width, height},
      },
    }: LayoutChangeEvent) => {
      setSize({width, height});
    },
    [],
  );

  return {size, onLayout};
};
