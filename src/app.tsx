import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { CampingProvider } from '@/store/CampingContext';
import './app.scss';

function App(props) {
  useEffect(() => {}, []);

  useDidShow(() => {});

  useDidHide(() => {});

  return (
    <CampingProvider>
      {props.children}
    </CampingProvider>
  );
}

export default App;
