import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Icon,
  Text,
  Button,
  List,
  ListItem,
  Spinner,
} from 'native-base';

import PropTypes from 'prop-types';
import {Dimensions, ScrollView, SafeAreaView} from 'react-native';
import {fetchGET, fetchDELETE, fetchPOST} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
import {getAdsByTag} from '../hooks/APIHooks';
import SimpleCarousel from '../components/SimpleCarousel';


const deviceHeight = Dimensions.get('window').height;

const Single = (props) => {
  const [adFiles, setAdFiles] = useState([]);
  const [showFavBtn, setShowFavBtn] = useState(true);
  const [loading, setLoading] = useState(true);
  const {navigation} = props;
  const file = navigation.state.params.file;

  // checks whether car is already in logged in user's favList or not
  const addFavBtnToggler = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const favList = await fetchGET('favourites', '', token);
    console.log('favList', favList);
    const adExists = favList.some((favObj) => {
      if (file.file_id === favObj.file_id) {
        return true;
      } else {
        return false;
      }
    });
    console.log('adExists', adExists);
    if (adExists) {
      setShowFavBtn(false);
    } else {
      setShowFavBtn(true);
    }
  };

  const removeFromFavList = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    const del = await fetchDELETE('favourites/file', file.file_id, token);
    console.log('filters received as prop', navigation.state.params.filters);
    if (del) {
      navigation.state.params.getMedia('updateAll');
      setShowFavBtn(true);
    }
    setLoading(false);
  };

  const addToFavList = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    const dataObject = {
      file_id: file.file_id,
    };
    const response = await fetchPOST('favourites', dataObject, token);
    console.log('filters received as prop', navigation.state.params.filters);
    if (response.message) {
      navigation.state.params.getMedia('updateAll');
      setShowFavBtn(false);
    }
    setLoading(false);
  };

  const getAdImages = async () => {
    try {
      setLoading(true);
      const adArray = await getAdsByTag(file.description.regNo);
      setAdFiles(adArray);
    } catch (e) {
      console.log('getAdImages', e.message);
    }
  };

  useEffect(() => {
    getAdImages();
    addFavBtnToggler();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [adFiles]);

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <Spinner/>
      ) : (
      <>
        <View style ={{width: '100%', height: deviceHeight / 3}}>
          <SimpleCarousel images={adFiles}/>
        </View>
        <View style={{height: deviceHeight / 2}}>
          <SafeAreaView style={{flex: 1}}>
            <ScrollView style={{}}>
              <List>
                <ListItem itemDivider
                  style={{backgroundColor: 'blue', justifyContent: 'center'}}>
                  <Text
                    style={{fontSize: 16,
                      fontWeight: 'bold',
                      color: 'white'}}>
                        Car Details
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>Reg. No: {file.description.regNo}</Text>
                </ListItem>
                <ListItem>
                  <Text>Make: {file.description.model}</Text>
                </ListItem>
                <ListItem>
                  <Text>Year: {file.description.year}</Text>
                </ListItem>
                <ListItem>
                  <Text>Mileage: {file.description.mileage}</Text>
                </ListItem>
                <ListItem>
                  <Text>Engine: {file.description.engine}</Text>
                </ListItem>
                <ListItem>
                  <Text>GearBox: {file.description.gearbox}</Text>
                </ListItem>
                <ListItem>
                  <Text>Fuel Type: {file.description.fuel}</Text>
                </ListItem>
                <ListItem>
                  <Text>Engine: {file.description.engine}</Text>
                </ListItem>
                <ListItem>
                  <Text>Price {file.description.price}</Text>
                </ListItem>
                <ListItem itemDivider
                  style={{backgroundColor: 'blue', justifyContent: 'center'}}>
                  <Text
                    style={{fontSize: 16,
                      fontWeight: 'bold',
                      color: 'white'}}>
                        Owner Details
                  </Text>
                </ListItem>
                {file.description.ownerName && <ListItem>
                  <Text>Name: {file.description.ownerName}</Text>
                </ListItem>}
                <ListItem>
                  <Text>Email: {file.description.ownerEmail}</Text>
                </ListItem>
              </List>
            </ScrollView>
          </SafeAreaView>
        </View>

        <View style={{marginBottom: 20}}>
          {showFavBtn && <Button
            full
            danger
            onPress={addToFavList}>
            <Text>
              <Icon name='heart' style={{fontSize: 24, color: 'pink'}}></Icon>
              Add to Favourites
              <Icon name='heart' style={{fontSize: 24, color: 'pink'}}/></Text>
          </Button>}
          {!showFavBtn && <Button
            full
            warning
            onPress={removeFromFavList}
          >
            <Text style={{color: 'black'}}>
              <Icon name='heart' style={{fontSize: 24, color: 'black'}}></Icon>
              Remove from Favourites
              <Icon name='heart' style={{fontSize: 24, color: 'black'}}/></Text>
          </Button>}
        </View>
      </>
    )}
    </View>
  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
