import React, {useState, useEffect} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  H3,
  View,
  Icon,
  Text,
  DeckSwiper,
  Button,
  List,
  ListItem,
} from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import {Dimensions, Image} from 'react-native';
import {mediaURL} from '../constants/urlConst';
import {fetchGET, fetchDELETE, fetchPOST} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';
import {getAllMedia, getAllAds, getAdsByTag, getUserMedia} from '../hooks/APIHooks';
import SimpleCarousel from '../components/SimpleCarousel';

const deviceHeight = Dimensions.get('window').height;
const initState = [
  {
    "description": {
      "engine": "2.0",
      "fuel": "diesel",
      "gearbox": "automatic",
      "make": "BMW",
      "mileage": 34000,
      "model": "118",
      "price": 15000,
      "regNo": "ABC-123",
      "year": 2017,
    },
    "file_id": 312,
    "filename": "1713bbc9bbe8ec2e251892eb6ae3957f.jpg",
    "filesize": 56059,
    "media_type": "image",
    "mime_type": "image/jpeg",
    "thumbnails": {
      "w160": "1713bbc9bbe8ec2e251892eb6ae3957f-tn160.png",
      "w320": "1713bbc9bbe8ec2e251892eb6ae3957f-tn320.png",
      "w640": "1713bbc9bbe8ec2e251892eb6ae3957f-tn640.png",
    },
    "time_added": "2020-02-22T15:57:26.000Z",
    "title": "ABC-123",
    "user_id": 7,
  },
  {
    "description": {
      "engine": "2.0",
      "fuel": "diesel",
      "gearbox": "automatic",
      "make": "BMW",
      "mileage": 34000,
      "model": "118",
      "price": 22000,
      "regNo": "DEF-456",
      "year": 2019,
    },
    "file_id": 317,
    "filename": "aa19224b6ba04caa96fcc58c9eda0d28.jpg",
    "filesize": 402272,
    "media_type": "image",
    "mime_type": "image/jpeg",
    "thumbnails": {
      "w160": "aa19224b6ba04caa96fcc58c9eda0d28-tn160.png",
      "w320": "aa19224b6ba04caa96fcc58c9eda0d28-tn320.png",
      "w640": "aa19224b6ba04caa96fcc58c9eda0d28-tn640.png",
    },
  },
];
const images = [
  'https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png',
  'https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg',
  'https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg',
];

const cardsArray = [
  {
    text: 'Card One',
    name: 1,
  },
  {
    text: 'Card Two',
    name: 2,
  },
];

const cardsArray2 = [
  {
    text: 'Card Three',
    name: 1,
  },
  {
    text: 'Card Four',
    name: 2,
  },
];

// const singleAdObject = {
//   singleAdImages: [],
// };
const Single = (props) => {
  const [user, setUser] = useState({});
  const [adFiles, setAdFiles] = useState([]);
  const [showFavBtn, setShowFavBtn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const {navigation} = props;
  const file = navigation.state.params.file;


  const addCard = () => {
    // const cardArray = JSON.parse(JSON.stringify(cards));
    // cardArray.push({text: `Card ${cardArray.length + 1}`, name: cardArray.length + 1});
    // cardArray.push({text: `Card ${cardArray.length + 1}`, name: cardArray.length + 1});
    // console.log('cardArray', cardArray);
    setCards(cardsArray2);
  };

  // useEffect(() => {
  console.log('cardsStateChanged', cards);
  // }, [cards]);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      setUser(json);
    } catch (e) {
      console.log('getUser error', e);
    }
  };

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
    // const userFromStorage = await AsyncStorage.getItem('user');
    // const uData = JSON.parse(userFromStorage);
    const del = await fetchDELETE('favourites/file', file.file_id, token);
    if (del) {
      if (navigation.state.params.mode === 'all') {
        navigation.state.params.filterAds();
      } else {
        navigation.state.params.getMedia(navigation.state.params.mode);
      }

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
    if (response.message) {
      if (navigation.state.params.mode === 'all') {
        navigation.state.params.filterAds();
      } else {
        navigation.state.params.getMedia(navigation.state.params.mode);
      }
      setShowFavBtn(false);
    }
    setLoading(false);
  };

  const getAdImages = async () => {
    try {
      const adArray = await getAdsByTag(file.description.regNo);
      setAdFiles(adArray);
    } catch (e) {
      console.log('getAdImages', e.message);
    }
  };

  useEffect(() => {
    // getUser();
    getAdImages();
    addFavBtnToggler();
  }, []);

  // useEffect(() => {
  //   console.log('adImagesArrayChanged', singleAdMedia.singleAdImages);
  //   setLoading('false');
  // }, [singleAdMedia]);

  return (
    <>
      {/* <Container>
        <View>
          <Text>{file.title}</Text>
          {cards.length > 1 &&
          <DeckSwiper
            dataSource={cards}
            renderItem={(item) =>
              <Card style={{elevation: 3}}>
                <CardItem>
                  <Icon name="heart" style={{color: '#ED4A6A'}} />
                  <Text>{item.name}</Text>
                </CardItem>
              </Card>
            }
          />
          } */}
      <SimpleCarousel images={adFiles}/>
      {/* </View>
      </Container> */}
      {/* <Button
        full
        onPress={() => {
          addCard();
        }}
      >
        <Text>Add Card</Text>
      </Button> */}
      <List>
        <ListItem>
          <Text>Year Model: {file.description.year}</Text>
        </ListItem>
        <ListItem>
          <Text>Engine: {file.description.engine}</Text>
        </ListItem>
        <ListItem>
          <Text>Rek. nro: {file.description.regNo}</Text>
        </ListItem>
        <ListItem>
          <Text>Mileage: {file.description.mileage}</Text>
        </ListItem>
        <ListItem>
          <Text>Drive: Front Wheel</Text>
        </ListItem>
        <ListItem>
          <Text>Location: Espoo</Text>
        </ListItem>
        <ListItem>
          <Text>GearBox: {file.description.gearbox}</Text>
        </ListItem>
      </List>
      <View style={{marginBottom: 20}}>
        {showFavBtn && <Button
          full
          danger
          onPress={addToFavList}>
          <Text><Icon name='heart' style={{fontSize: 24, color: 'pink'}}></Icon> Add to Favourites <Icon name='heart' style={{fontSize: 24, color: 'pink'}}/></Text>
        </Button>}
        {!showFavBtn && <Button
          full
          warning
          onPress={removeFromFavList}
          >
          <Text style={{color: 'black'}}><Icon name='heart' style={{fontSize: 24, color: 'black'}}></Icon> Remove from Favourites <Icon name='heart' style={{fontSize: 24, color: 'black'}}/></Text>
        </Button>}
      </View>
    </>

  );
};

Single.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Single;
