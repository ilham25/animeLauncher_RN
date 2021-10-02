import React, {useEffect} from 'react';

import {View, Image, StatusBar, Dimensions, Appearance} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import images from '@assets/images';

import colors from '@utils/themes/colors';
import {getStorage} from '@utils/';
import {useDefaultContext} from '@utils/contexts';

const Window = Dimensions.get('window');

const SplashScreen = () => {
  const [{theme}, dispatch] = useDefaultContext();

  const colorScheme = Appearance.getColorScheme();

  const handleStorage = async () => {
    try {
      const getStorageData = await getStorage();
      if (getStorageData) {
        if (getStorageData.animeList) {
          dispatch({
            type: 'animeList',
            payload: {
              type: 'INITIAL',
              animeList:
                getStorageData.animeList.length === 0
                  ? []
                  : getStorageData.animeList,
            },
          });
        }
        if (getStorageData.wallpaper) {
          dispatch({
            type: 'wallpaper',
            payload: {
              type: 'INITIAL',
              wallpaper: !getStorageData.wallpaper
                ? ''
                : getStorageData.wallpaper,
            },
          });
        }
        if (getStorageData.wallpaperOpacity) {
          dispatch({
            type: 'wallpaperOpacity',
            payload: {
              type: 'INITIAL',
              wallpaperOpacity: !getStorageData.wallpaperOpacity
                ? 0.1
                : getStorageData.wallpaperOpacity,
            },
          });
        }
      }
      dispatch({
        type: 'theme',
        payload: {
          type: 'INITIAL',
          theme: !getStorageData?.theme
            ? colorScheme.toUpperCase()
            : getStorageData?.theme,
        },
      });
    } catch (error) {
      console.log('handleStorage err', error);
    }
  };

  useEffect(() => {
    handleStorage();
  }, []);
  return (
    <SafeAreaView>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors[theme ?? 'LIGHT'].PRIMARY}
      />
      <View
        style={{
          backgroundColor: colors[theme ?? 'LIGHT'].PRIMARY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: Window.height,
        }}>
        <Image
          source={images.splashImg}
          style={{height: 170, width: 270, resizeMode: 'contain'}}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
