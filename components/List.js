/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import {
  List as BaseList, Spinner, View,
} from 'native-base';
import ListItem from './ListItem';
import {MediaContext} from '../contexts/MediaContext';
import {getAllMedia, getAllAds, getAdsByTag, getUserMedia} from '../hooks/APIHooks';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';

const List = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  const getMedia = async (mode) => {
    try {
      console.log('mode', mode);
      // const allData = await getAllMedia();
      // const allAdData = await getAllAds();
      // const token = await AsyncStorage.getItem('userToken');
      if ( mode === 'myfiles') {
        const userFromStorage = await AsyncStorage.getItem('user');
        const uData = JSON.parse(userFromStorage);
        const myAdData = await getAdsByTag(uData.username);
        // Parsing description as JSON and attaching it back to description property.
        myAdData.forEach((ad) => {
          // console.log('ad.description', ad.description);
          ad.description = JSON.parse(ad.description);
        });
        // const myData = await getUserMedia(token);
        setMedia((media) => ({
          ...media,
          myFiles: myAdData,
        }));
      }
      // setMedia({
      //   allFiles: allData.reverse(),
      //   myFiles: myAdData,
      //   allAdFiles: allAdData,
      // });
      // console.log('allFiles', media.allFiles);
      // console.log('allAdFiles', media.allAdFiles);
      // setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const filterAds = async () => {
    try {
      console.log('filterAds function called');
      console.log('filterAds setting loading to true');
      setLoading(true);
      console.log('filtersObject', props.filters);
      let adList = [];
      // First Step: Pull adlist according to make and model filter.
      // If model filter is other than '' pull accordint to model.
      if (props.filters.model) {
        // pulling adList according to model
        console.log('pulling add list according to model');
        adList = await getAdsByTag(props.filters.model);
      } else {
        // pulling add list according to make
        console.log('pulling add list according to make');
        adList = await getAdsByTag(props.filters.make);
      }
      // console.log('addList after first step', adList);
      // Parsing description as JSON and attaching it back to description property.
      adList.forEach((ad) => {
        console.log('ad.description', ad.description);
        ad.description = JSON.parse(ad.description);
      });
      // Second Step: Filter pulled adList accordint to year
      // If year is not empty only then we filter adList
      if (props.filters.year !== 'Select Year') {
        // Filtering according to year
        const adListByYear = adList.filter((ad) => {
          // if (ad.description.year === parseInt(props.filters.year, 10)) {
          if (ad.description.year === props.filters.year) {
            return true;
          }
        });
        // console.log('adListByYear', adListByYear);
        adList = adListByYear;
      }
      // console.log('addList after second step', adList);
      // Third Step: Sort adList according to selected sorting option
      sortAds(adList, props.filters.sort);
      // console.log('addList after third step', adList);
      // Last Step: Update context with final filtered list
      setMedia((media) => ({
        ...media,
        allAdFiles: adList,
      }));
    } catch (e) {
      console.log(e.message);
    }
  };

  const sortAds = (adList, sortMethod) => {
    if (sortMethod === 'cheapestFirst') {
      adList.sort((a, b) => a.description.price - b.description.price);
    } else if (sortMethod === 'expensiveFirst') {
      adList.sort((a, b) => b.description.price - a.description.price);
    } else if (sortMethod === 'oldestCarFirst') {
      adList.sort((a, b) => a.description.year - b.description.year);
    } else if (sortMethod === 'newestCarFirst') {
      adList.sort((a, b) => b.description.year - a.description.year);
    } else {
      return adList;
    }
  };

  const gettingAdsByMake = async () => {
    try {
      console.log('gettingAdsByMake function call from second useEffect');
      console.log('filters', props.filters);
      setLoading(true);
      const adDataByMake = await getAdsByTag(props.filters.make);
      console.log('adDataByMake', adDataByMake);
      setMedia((media) => ({
        ...media,
        allAdFiles: adDataByMake,
      }));
      // setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const gettingAdsByModel = async () => {
    try {
      console.log('gettingAdsByModel function call from second useEffect');
      console.log('filters', props.filters);
      setLoading(true);
      const adDataByModel = await getAdsByTag(props.filters.model);
      console.log('adDataByMake', adDataByModel);
      setMedia((media) => ({
        ...media,
        allAdFiles: adDataByModel,
      }));
      // setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const filterByYear = async () => {
    console.log('filterByYear function called');
    const filteredList = media.allAdFiles.filter((ad) => {
      const description = JSON.parse(ad.description);
      if (description.year === props.filters.year) {
        return true;
      }
    });
    setMedia((media) => ({
      ...media,
      allAdFiles: filteredList,
    }));
  };

  // useEffect(() => {
  //   getMedia(props.mode);
  // }, []);


  useEffect(() => {
    // some function
    if (props.mode === 'all') {
      filterAds();
    } else {
      getMedia(props.mode);
    }
  }, [props.filters]);

  useEffect(() => {
    console.log('useEffect function watching media context');
    // console.log(media.allAdFiles);
    // console.log('setting loading to false');
    // getMedia(props.mode);
    setLoading(false);
  }, [media]);

  // useEffect(() => {
  //   gettingAdsByMake();
  // }, [props.filters.make]);

  // useEffect(() => {
  //   gettingAdsByModel();
  // }, [props.filters.model]);


  return (
    <View style={{flex: 1}}>
      {loading ? (
        <Spinner/>
      ) : (
        <>
          {props.mode === 'all' &&
          <BaseList
            dataArray={media.allAdFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItem
              navigation={props.navigation}
              singleMedia={item}
              mode={props.mode}
              getMedia={getMedia}
            />}
          />
          }
          {props.mode === 'myfiles' &&
          <BaseList
            dataArray={media.myFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <ListItem
              navigation={props.navigation}
              singleMedia={item}
              mode={props.mode}
              getMedia={getMedia}
            />}
          />
          }
        </>
      )}
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string,
  filters: PropTypes.object,
};

export default List;
