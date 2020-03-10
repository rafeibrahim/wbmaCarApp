import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const MyFavouritesList = (props) => {
  const {navigation} = props;
  return (
    <List navigation={navigation} mode={'favfiles'}></List>
  );
};

MyFavouritesList.propTypes = {
  navigation: PropTypes.object,
};

export default MyFavouritesList;
