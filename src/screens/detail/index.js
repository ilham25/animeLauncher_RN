import React, {useEffect, useState, useRef} from 'react';

import {View, Dimensions, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SendIntentAndroid from 'react-native-send-intent';
import BottomSheet from 'react-native-raw-bottom-sheet';

import CustomFab from '@components/atoms/customFab';
import Layout from '@components/layout';
import Header from '@components/layout/header';
import Description from '@components/organisms/detail/description';
import EpisodeList from '@components/organisms/detail/episodeList';
import MenuComponent from '@components/organisms/home/menu';

import images from '@assets/images';

import colors from '@utils/themes/colors';
import {getEpisodes} from '@utils/';
import {useDefaultContext} from '@utils/contexts';

const Screen = Dimensions.get('screen');

const AnimeDetailpage = ({route, navigation}) => {
  const {animeId} = route.params || {};

  const bottomSheet = useRef();

  const [dataSource, setDataSource] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState({
    id: '',
    title: '',
  });

  const [state, dispatch] = useDefaultContext();

  const anime = state.animeList.find(anime => anime.id === animeId);

  const {title, episodes, directory, image, history} = anime || {};

  const handleEpisodesList = async () => {
    try {
      const eps = await getEpisodes(directory);
      setDataSource(eps.map((item, idx) => ({id: idx, file: item})));
    } catch (error) {
      console.log('handleEpisodesList err', error);
    }
  };

  const handleOpenFile = () => {
    const episodeToPlayIndex =
      history?.length > 0 ? history[history.length - 1] - 1 : 0;

    SendIntentAndroid.openAppWithData(
      null,
      dataSource[episodeToPlayIndex].file,
      'video/*',
    );
    if (history?.length === 0) {
      dispatch({
        type: 'animeList',
        payload: {
          type: 'CREATE_ANIME_HISTORY',
          animeId: animeId,
          selectedEpisode: episodeToPlayIndex + 1,
        },
      });
    }
  };

  useEffect(() => {
    handleEpisodesList();
  }, []);

  return (
    <Layout fullscreen>
      <View
        style={{
          height: Screen.height * 0.4,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'black',
        }}>
        <Image
          source={
            image
              ? {
                  uri: `file://${image}`,
                }
              : images.thumbnail
          }
          style={{
            height: Screen.height * 0.4,
            width: Screen.width,
            resizeMode: 'cover',
            opacity: 0.75,
          }}
        />
        <SafeAreaView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}>
          <Header
            fullscreen
            title=""
            style={{
              width: Screen.width,
            }}
            left={{
              name: 'arrow-back',
              color: colors['LIGHT'].WHITE,
              onPress: () => {
                navigation.goBack();
              },
            }}
            right={{
              name: 'more-vert',
              color: colors['LIGHT'].WHITE,
              onPress: () => {
                setSelectedAnime(anime);
                bottomSheet.current.open();
              },
            }}
          />
        </SafeAreaView>
      </View>
      <View
        style={{
          height: Screen.height * 0.6,
          backgroundColor: colors[state.theme].WHITE,
          padding: 20,
          position: 'relative',
        }}>
        <Description title={title} episodes={episodes} history={history} />
        <EpisodeList title={title} dataSource={dataSource} anime={anime} />
        <CustomFab
          style={{top: -37.5, right: Screen.width * 0.1}}
          icon="play-arrow"
          onPress={() => {
            handleOpenFile();
          }}
        />
      </View>
      <BottomSheet
        ref={bottomSheet}
        height={250}
        customStyles={{
          container: {
            padding: 20,
            backgroundColor: colors[state.theme ?? 'LIGHT'].BACKGROUND,
          },
        }}>
        <MenuComponent
          selectedAnimeProps={{get: selectedAnime, set: setSelectedAnime}}
          bottomSheetRef={bottomSheet}
          showClearHistory
        />
      </BottomSheet>
    </Layout>
  );
};

export default AnimeDetailpage;
