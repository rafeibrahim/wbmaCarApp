import React, {useEffect, useContext} from 'react';
import {
  Content,
  Form,
  Button,
  Text,
  Item,
  Spinner,
  View,
  Picker,
  Badge,
  H3,
} from 'native-base';

import {
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import {validateField} from '../utils/validation';
import {uploadConstraints} from '../constants/validationConst';
import {bmwModels,
  toyotaModels,
  audiModels,
  mercedesModels,
  hondaModels,
  engineList,
  yearList,
  mileageList}
  from '../constants/optionsConst';
import {mediaURL} from '../constants/urlConst';
import AsyncImage from '../components/AsyncImage';

const deviceHeight = Dimensions.get('window').height;

const Modify = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const file = props.navigation.state.params.file;
  const getMedia = props.navigation.state.params.getMedia;
  const descriptionObject = file.description;
  // for testing purpose only
  // console.log('descriptionObject', descriptionObject);

  const {
    handleMakeChange,
    handleModelChange,
    handleYearChange,
    handleEngineChange,
    handleMileageChange,
    handleGearboxChange,
    handleFuelChange,
    handlePriceChange,
    handleModify,
    inputs,
    errors,
    setErrors,
    setInputs,
    loading,
  } = useUploadForm();

  // function for displaying right model picker as per user make selection
  const displayModelPicker = () => {
    if (inputs.make === '' || inputs.make === undefined) {
      return null;
    }
    let displayModels = [];
    if (inputs.make === 'Bmw' ) {
      displayModels = bmwModels;
    } else if (inputs.make === 'Toyota') {
      displayModels = toyotaModels;
    } else if (inputs.make === 'Audi') {
      displayModels = audiModels;
    } else if (inputs.make === 'Mercedes') {
      displayModels = mercedesModels;
    } else if (inputs.make === 'Honda') {
      displayModels = hondaModels;
    }

    return <>
      <Text style={{textAlign: 'center', marginTop: 0, fontWeight: 'bold', color: 'royalblue'}}>MODEL</Text>
      <Item style={{margin: 10}}>
        <View
          style={{width: '100%',
            height: 40,
            borderWidth: 1,
            borderColor: 'black',
            alignItems: 'center'}}>
          <Picker
            mode="dropdown"
            selectedValue={inputs.model}
            style={{width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              console.log(itemValue);
              handleModel(itemValue);
            }
            }>
            {displayModels.map((m) => {
              return <Picker.Item
                label={m.modelLabel}
                value={m.model}
                key={(item, index) => index.toString()}/>;
            })}
          </Picker>
        </View>
      </Item>
      {errors.model &&
      <Badge warning style={{width: '100%'}}><Text>{errors.model}</Text></Badge>
      }
    </>;
  };

  const validationProperties = {
    title: {title: inputs.title},
    description: {description: inputs.description},
  };

  // for validation of regNo and price fields
  const validate = (field, value) => {
    console.log('vp', validationProperties[field]);
    setErrors((errors) =>
      ({
        ...errors,
        [field]: validateField({[field]: value},
            uploadConstraints),
        fetch: undefined,
      }));
    // console.log(validateField({[field]: value}, uploadConstraints));
    // returning boolean to check input fields before modify btn works
    if (validateField({[field]: value}, uploadConstraints) === undefined) {
      return true;
    } else {
      return false;
    }
  };

  // initializing pickers with stored values of carAd which needs to be modified
  useEffect(() => {
    setInputs((inputs) =>
      ({
        ...inputs,
        regNo: descriptionObject.regNo,
        price: descriptionObject.price,
        make: descriptionObject.make,
        model: descriptionObject.model,
        year: descriptionObject.year,
        mileage: descriptionObject.mileage,
        gearbox: descriptionObject.gearbox,
        engine: descriptionObject.engine,
        fuel: descriptionObject.fuel,
      }));
  }, []);

  const handleMake = (text) => {
    handleMakeChange(text);
    checkPickerError('make', text);
  };

  const handleModel = (text) => {
    handleModelChange(text);
    checkPickerError('model', text);
  };

  const handleYear = (text) => {
    handleYearChange(text);
    checkPickerError('year', text);
  };

  const handleEngine = (text) => {
    handleEngineChange(text);
    checkPickerError('engine', text);
  };

  const handleMileage = (text) => {
    handleMileageChange(text);
    checkPickerError('mileage', text);
  };

  const handleGearbox = (text) => {
    handleGearboxChange(text);
    checkPickerError('gearbox', text);
  };

  const handleFuel = (text) => {
    handleFuelChange(text);
    checkPickerError('fuel', text);
  };

  const handlePrice = (text) => {
    handlePriceChange(text);
    validate('price', text);
  };

  // checking if the picker value is empty or not
  const checkPickerError = (field, picker) => {
    if (picker === '') {
      setErrors((errors) => ({
        ...errors,
        [field]: `${field} cannot be empty`,
      }));
      return false;
    }
    setErrors((errors) => ({
      ...errors,
      [field]: undefined,
    }));
    return true;
  };

  const modify = () => {
    // validating all fields before activating modify btn
    const priceOK = validate('price', inputs.price);
    const makeOK = checkPickerError('make', inputs.make);
    const modelOK = checkPickerError('model', inputs.model);
    const yearOK = checkPickerError('year', inputs.year);
    const mileageOK = checkPickerError('mileage', inputs.mileage);
    const gearboxOK = checkPickerError('gearbox', inputs.gearbox);
    const fuelOK = checkPickerError('fuel', inputs.fuel);
    const engineOK = checkPickerError('engine', inputs.engine);

    if (priceOK && makeOK && modelOK && yearOK &&
      mileageOK && gearboxOK && fuelOK && engineOK) {
      console.log('modify btn working');
      setErrors((errors) => ({
        ...errors,
        inputsError: undefined,
      }));
      handleModify(file.file_id, props.navigation, setMedia, getMedia);
    } else {
      console.log('modify btn not working');
      setErrors((errors) => ({
        ...errors,
        inputsError: 'One or more fields require your attention',
      }));
    }
  };

  // for testing purposes only
  // useEffect(() => {
  //   console.log('inputs', inputs);
  // }, [inputs]);

  // for testing purposes only
  // useEffect(() => {
  //   console.log('inputs', inputs);
  //   console.log('errors from useEffect', errors);
  // }, [errors]);

  return (
    <Content>
      {loading ? (
        <Spinner/>
      ) : (
        <Form>
          <AsyncImage
            style={{
              width: '100%',
              height: deviceHeight / 4,
            }}
            spinnerColor='#777'
            source={{uri: mediaURL + file.filename}}
          />
          <Text style={{textAlign: 'center', marginTop: 10, fontWeight: 'bold', color: 'royalblue'}}>PRICE</Text>
          <FormTextInput
            placeholder='Price'
            onChangeText={handlePrice}
            value={inputs.price + ''}
            error={errors.price}
          />
          {/* {Disabled because it hinders filter operation on home screen} */}
          {/* <Text style={{textAlign: 'center', marginTop: 0, fontWeight: 'bold', color: 'royalblue'}}>MAKE</Text>
          <Item style={{margin: 10}}>
            <View
              style={{width: '100%',
                height: 40,
                borderWidth: 1,
                borderColor: 'black',
                alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.make}
                style={{width: '100%'}}
                itemStyle={{height: 44}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleMake(itemValue);
                }
                }>
                <Item label="Select Make" value="" />
                <Item label="Audi" value="Audi" />
                <Item label="BMW" value="Bmw" />
                <Item label="Mercedes" value="Mercedes" />
                <Item label="Toyota" value="Toyota" />
                <Item label="Honda" value="Honda" />
              </Picker>
            </View>
          </Item>
          {errors.make &&
            <Badge
              warning
              style={{width: '100%'}}>
              <Text>{errors.make}</Text>
            </Badge>
          }
          {displayModelPicker()} */}
          <Text
            style={{textAlign: 'center',
              marginTop: 0,
              fontWeight: 'bold',
              color: 'royalblue'}}>YEAR</Text>
          <Item style={{margin: 10}}>
            <View
              style={{width: '100%',
                height: 40,
                borderWidth: 1,
                borderColor: 'black',
                alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.year}
                style={{width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleYear(itemValue);
                }
                }>
                {yearList.map((year) => {
                  if (year === 'Select Year') {
                    return <Picker.Item
                      label={year}
                      value=''
                      key={(item, index) => index.toString()}/>;
                  }
                  return <Picker.Item
                    label={year + ''}
                    value={year}
                    key={(item, index) => index.toString()}/>;
                })}
              </Picker>
            </View>
          </Item>
          {errors.year &&
            <Badge
              warning
              style={{width: '100%'}}>
              <Text>{errors.year}</Text>
            </Badge>
          }
          <Text
            style={{textAlign: 'center',
              marginTop: 0,
              fontWeight: 'bold',
              color: 'royalblue'}}>MILEAGE</Text>
          <Item style={{margin: 10}}>
            <View
              style={{width: '100%',
                height: 40, borderWidth: 1,
                borderColor: 'black',
                alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.mileage}
                style={{width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleMileage(itemValue);
                }
                }>
                {mileageList.map((mileage) => {
                  if (mileage === 'Select Mileage') {
                    return <Picker.Item
                      label={mileage}
                      value=''
                      key={(item, index) => index.toString()}/>;
                  }
                  return <Picker.Item
                    label={mileage + ''}
                    value={mileage}
                    key={(item, index) => index.toString()}/>;
                })}
              </Picker>
            </View>
          </Item>
          {errors.mileage &&
            <Badge
              warning
              style={{width: '100%'}}>
              <Text>{errors.mileage}</Text>
            </Badge>
          }
          <Text
            style={{textAlign: 'center',
              marginTop: 0,
              fontWeight: 'bold',
              color: 'royalblue'}}>GEARBOX</Text>
          <Item style={{margin: 10}}>
            <View
              style={{width: '100%',
                height: 40,
                borderWidth: 1,
                borderColor: 'black',
                alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.gearbox}
                style={{width: '100%'}}
                itemStyle={{height: 44}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleGearbox(itemValue);
                }
                }>
                <Item label="Select Gearbox" value="" />
                <Item label="automatic" value="automatic" />
                <Item label="manual" value="manual" />
              </Picker>
            </View>
          </Item>
          {errors.gearbox &&
            <Badge
              warning
              style={{width: '100%'}}>
              <Text>{errors.gearbox}</Text>
            </Badge>
          }
          <Text
            style={{textAlign: 'center',
              marginTop: 0,
              fontWeight: 'bold',
              color: 'royalblue'}}>FUEL TYPE</Text>
          <Item style={{margin: 10}}>
            <View
              style={{width: '100%',
                height: 40,
                borderWidth: 1,
                borderColor: 'black',
                alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.fuel}
                style={{width: '100%'}}
                itemStyle={{height: 44}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleFuel(itemValue);
                }
                }>
                <Item label="Select Fuel Type" value="" />
                <Item label="petrol" value="petrol" />
                <Item label="diesel" value="diesel" />
                <Item label="hybrid" value="hybrid"/>
                <Item label="electric" value="electric" />
              </Picker>
            </View>
          </Item>
          {errors.fuel &&
            <Badge
              warning
              style={{width: '100%'}}>
              <Text>{errors.fuel}</Text>
            </Badge>
          }
          <Text
            style={{textAlign: 'center',
              marginTop: 0,
              fontWeight: 'bold',
              color: 'royalblue'}}>ENGINE CAPACITY</Text>
          <Item style={{margin: 10}}>
            <View
              style={
                {width: '100%',
                  height: 40,
                  borderWidth: 1,
                  borderColor: 'black',
                  alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.engine}
                style={{width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  handleEngine(itemValue);
                }
                }>
                {engineList.map((engine) => {
                  if (engine === 'Select Engine Capacity') {
                    return <Picker.Item
                      label={engine}
                      value=''
                      key={(item, index) => index.toString()}/>;
                  }
                  return <Picker.Item
                    label={engine}
                    value={engine}
                    key={(item, index) => index.toString()}/>;
                })}
              </Picker>
            </View>
          </Item>
          {errors.engine &&
            <Badge
              warning
              style={{width: '100%'}}>
              <Text>{errors.engine}</Text>
            </Badge>
          }
          <Button full onPress={modify}>
            <Text>Modify Ad</Text>
          </Button>
          {errors.inputsError &&
            <Badge
              style={{width: '100%'}}>
              <Text>{errors.inputsError}</Text>
            </Badge>
          }
        </Form>
      )}
    </Content>
  );
};

// proptypes here
Modify.propTypes = {
  navigation: PropTypes.object,
};

export default Modify;
