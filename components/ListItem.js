import React from 'react';
import {
  ListItem as BaseListItem,
  Left,
  Body,
  Right,
  Button,
  Text,
  Thumbnail,
  H3,
  Icon,
} from 'native-base';
import PropTypes from 'prop-types';
import {mediaURL} from '../constants/urlConst';
import {fetchDELETE} from '../hooks/APIHooks';
import {AsyncStorage} from 'react-native';


const ListItem = (props) => {
  const descriptionObject = props.singleMedia.description;
  return (
    <BaseListItem thumbnail>
      <Left>
        <Thumbnail
          square
          source={{uri: mediaURL + props.singleMedia.thumbnails.w160}}
        />
      </Left>
      <Body>
        <Text numberOfLines={1} style={{fontWeight: 'bold'}}>
          {descriptionObject.make} {descriptionObject.model} <Text style={{fontSize: 14, fontWeight: 'normal'}}>{descriptionObject.engine}</Text>
        </Text>
        <Text numberOfLines={1} style={{fontSize: 14}}>
          {descriptionObject.year} | {descriptionObject.fuel} | {descriptionObject.gearbox}
        </Text>
        <Text numberOfLines={1} style={{fontSize: 14}}>
          {descriptionObject.mileage} km | <Text style={{color: 'cornflowerblue', fontSize: 14, fontWeight: 'bold'}}>{descriptionObject.price}€</Text>
        </Text>
      </Body>
      <Right>
        <Button onPress={
          () => {
            props.navigation.push('Single', {file: props.singleMedia});
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
                props.navigation.push('Modify', {file: props.singleMedia});
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
              const del = await fetchDELETE('media', props.singleMedia.file_id,
                  token);
              console.log('delete', del);
              if (del.message) {
                props.getMedia(props.mode);
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
};

export default ListItem;

