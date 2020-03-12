import React from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Thumbnail,
  Icon,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {delCarAd} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';


const ListItem = (props) => {
  const descriptionObject = props.singleMedia.description;
  const hearts = props.singleMedia.favList.length;
  console.log('hearts', hearts, props.singleMedia.file_id);
  return (
    <BaseListItem thumbnail>
      <Left>
        <Thumbnail
          square
          source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}
        />
      </Left>
      <Body>
        <Text
          numberOfLines={1}
          style={{fontWeight: 'bold'}}>
          {descriptionObject.model} <Text
            style={{fontSize: 14, fontWeight: 'normal'}}>
            {descriptionObject.engine}</Text>
        </Text>
        <Text numberOfLines={1} style={{fontSize: 14}}>
          {descriptionObject.year} | {descriptionObject.fuel} | {descriptionObject.gearbox}
        </Text>
        <Text numberOfLines={1} style={{fontSize: 14}}>
          {descriptionObject.mileage} km | <Text
            style={{color: 'cornflowerblue', fontSize: 14, fontWeight: 'bold'}}>
            {descriptionObject.price}€</Text> | {hearts > 0 && <Text style={{color: 'pink', fontWeight: 'bold'}}>{hearts}<Icon name='heart' style={{fontSize: 18, color: 'pink'}}/></Text>}
        </Text>
      </Body>
      <Right>
        <Button onPress={
          () => {
            props.navigation.push(
                'Single',
                {file: props.singleMedia,
                  mode: props.mode,
                  getMedia: props.getMedia});
          }
        }>
          <Icon name='eye'/>
        </Button>
        {props.mode === 'myfiles' &&
        <>
          <Button
            full
            warning
            onPress={
              () => {
                props.navigation.push(
                    'Modify',
                    {file: props.singleMedia,
                      getMedia: props.getMedia});
              }
            }
          >
            <Icon name='create'/>
          </Button>
          <Button
            full
            danger
            onPress={async () => {
              const token = await AsyncStorage.getItem('userToken');
              const del = await delCarAd(descriptionObject.regNo, token);
              if (del) {
                console.log(props.mode);
                props.getMedia('updateAll');
              }
            }}
          >
            <Icon name='trash'/>
          </Button>
        </>
        }
      </Right>
    </BaseListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  mode: PropTypes.string,
  getMedia: PropTypes.func,
  filterAds: PropTypes.func,
};

export default ListItem;

