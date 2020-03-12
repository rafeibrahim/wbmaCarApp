import React from 'react';
import {Input, Badge, Item, Text, View} from 'native-base';
import PropTypes from 'prop-types';

const FormTextInput = (props) => {
  const {error, ...otherProps} = props;
  return (
    <>
      <Item style={{margin: 10}}>
        <View
          style={{width: '100%',
            height: 40,
            borderWidth: 1,
            borderColor: 'black'}}>
          <Input
            {...otherProps}
          />
        </View>
      </Item>
      {error &&
      <Badge warning style={{width: '100%'}}><Text>{error}</Text></Badge>
      }
    </>
  );
};

FormTextInput.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.string,
};

export default FormTextInput;
