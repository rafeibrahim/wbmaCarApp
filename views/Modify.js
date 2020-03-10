import React, {useState, useEffect, useContext} from 'react';
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
} from 'native-base';

import {
  Dimensions,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import {validateField} from '../utils/validation';
import {uploadConstraints} from '../constants/validationConst';
import {bmwModels, toyotaModels, audiModels, mercedesModels, hondaModels, years, years1, mileageList, gearboxList} from '../constants/optionsConst';
import {mediaURL} from '../constants/urlConst';
import AsyncImage from '../components/AsyncImage';
import {Video} from 'expo-av';

const deviceHeight = Dimensions.get('window').height;

const Modify = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [send, setSend] = useState(false);

  const {
    handleTitleChange,
    handleDescriptionChange,
    handleMakeChange,
    handleModelChange,
    handleYearChange,
    handleMileageChange,
    handleGearboxChange,
    handleRegNoChange,
    handlePriceChange,
    handleModify,
    inputs,
    errors,
    setErrors,
    setInputs,
    loading,
  } = useUploadForm();

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
      <Item style={{margin: 10}}>
        <View style={{width: '100%', height: 40, borderWidth: 1, borderColor: 'black', alignItems: 'center'}}>
          <Picker
            mode="dropdown"
            selectedValue={inputs.model}
            style={{width: '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              console.log(itemValue);
              handleModel(itemValue);
              // setFilters((filters) =>
              //   ({
              //     ...filters,
              //     model: itemValue,
              //   }));
            }
            }>
            {displayModels.map((m) => {
              return <Picker.Item label={m.modelLabel} value={m.model}/>
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

  const validate = (field, value) => {
    console.log('vp', validationProperties[field]);
    setErrors((errors) =>
      ({
        ...errors,
        [field]: validateField({[field]: value},
            uploadConstraints),
        fetch: undefined,
      }));
    console.log(validateField({[field]: value}, uploadConstraints));
    if (validateField({[field]: value}, uploadConstraints) === undefined) {
      return true;
    } else {
      return false;
    }
  };

  const file = props.navigation.state.params.file;
  const descriptionObject = file.description;
  console.log('descriptionObject', descriptionObject);

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
      }));
  }, []);

  useEffect(() => {
    console.log('inputs', inputs);
  }, [inputs]);

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

  const handleMileage = (text) => {
    handleMileageChange(text);
    checkPickerError('mileage', text);
  };

  const handleGearbox = (text) => {
    handleGearboxChange(text);
    checkPickerError('gearbox', text);
  };

  const handleRegNo = (text) => {
    handleRegNoChange(text);
    validate('regNo', text);
  };

  const handlePrice = (text) => {
    handlePriceChange(text);
    validate('price', text);
  };

  // const handleTitle = (text) => {
  //   handleTitleChange(text);
  //   validate('title', text);
  // };

  // const handleDescription = (text) => {
  //   handleDescriptionChange(text);
  //   validate('description', text);
  // };

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
    const priceOK = validate('price', inputs.price);
    const makeOK = checkPickerError('make', inputs.make);
    const modelOK = checkPickerError('model', inputs.model);
    const yearOK = checkPickerError('year', inputs.year);
    const mileageOK = checkPickerError('mileage', inputs.mileage);
    const gearboxOK = checkPickerError('gearbox', inputs.gearbox);
    // console.log('reg field errors', errors);
    // console.log('makeOK', makeOK, modelOK, yearOK, mileageOK, gearboxOK);
    if (priceOK && makeOK && modelOK && yearOK && mileageOK && gearboxOK) {
      console.log('modify btn working');
      setErrors((errors) => ({
        ...errors,
        inputsError: undefined,
      }));
      handleModify(file.file_id, props.navigation, setMedia);
    } else {
      console.log('modify btn not working');
      setErrors((errors) => ({
        ...errors,
        inputsError: 'One or more fields require your attention',
      }));
    }
  };

  // const checkErrors = () => {
  //   console.log('errors', errors);
  //   if (errors.title !== undefined ||
  //     errors.description !== undefined) {
  //     setSend(false);
  //   } else {
  //     setSend(true);
  //   }
  // };

  useEffect(() => {
    // checkErrors();
    console.log('inputs', inputs);
    console.log('errors from useEffect', errors);
  }, [errors]);

  console.log('send', send);

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
          {/* <Item>
            <FormTextInput
              placeholder='Title'
              onChangeText={handleTitle}
              value={inputs.title}
              error={errors.title}
            />
          </Item> */}
          <FormTextInput
            placeholder='Price'
            onChangeText={handlePrice}
            value={inputs.price + ''}
            error={errors.price}
          />
          <Item style={{margin: 10}}>
            <View style={{width: '100%', height: 40, borderWidth: 1, borderColor: 'black', alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.make}
                style={{width: '100%'}}
                itemStyle={{height: 44}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleMake(itemValue);
                  // setFilters((filters) =>
                  //   ({
                  //     ...filters,
                  //     make: itemValue,
                  //     model: '',
                  //   }));
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
            <Badge warning style={{width: '100%'}}><Text>{errors.make}</Text></Badge>
          }
          {displayModelPicker()}
          <Item style={{margin: 10}}>
            <View style={{width: '100%', height: 40, borderWidth: 1, borderColor: 'black', alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.year}
                style={{width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleYear(itemValue);
                  // setFilters((filters) =>
                  //   ({
                  //     ...filters,
                  //     year: itemValue,
                  //   }));
                }
                }>
                {years1.map((year) => {
                  // console.log(years.reverse());
                  // console.log('year', year);
                  if (year === 'Select Year') {
                    return <Picker.Item label={year} value=''/>;
                  }
                  return <Picker.Item label={year + ''} value={year} key={(item, index) => index.toString()}/>;
                })}
              </Picker>
            </View>
          </Item>
          {errors.year &&
            <Badge warning style={{width: '100%'}}><Text>{errors.year}</Text></Badge>
          }
          <Item style={{margin: 10}}>
            <View style={{width: '100%', height: 40, borderWidth: 1, borderColor: 'black', alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.mileage}
                style={{width: '100%'}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleMileage(itemValue);
                  // setFilters((filters) =>
                  //   ({
                  //     ...filters,
                  //     year: itemValue,
                  //   }));
                }
                }>
                {mileageList.map((mileage) => {
                  // console.log(years.reverse());
                  // console.log('year', year);
                  if (mileage === 'Select Mileage') {
                    return <Picker.Item label={mileage} value=''/>;
                  }
                  return <Picker.Item label={mileage + ''} value={mileage} key={(item, index) => index.toString()}/>;
                })}
              </Picker>
            </View>
          </Item>
          {errors.mileage &&
            <Badge warning style={{width: '100%'}}><Text>{errors.mileage}</Text></Badge>
          }
          <Item style={{margin: 10}}>
            <View style={{width: '100%', height: 40, borderWidth: 1, borderColor: 'black', alignItems: 'center'}}>
              <Picker
                mode="dropdown"
                selectedValue={inputs.gearbox}
                style={{width: '100%'}}
                itemStyle={{height: 44}}
                onValueChange={(itemValue, itemIndex) => {
                  console.log(itemValue);
                  handleGearbox(itemValue);
                  // setFilters((filters) =>
                  //   ({
                  //     ...filters,
                  //     make: itemValue,
                  //     model: '',
                  //   }));
                }
                }>
                <Item label="Select Gearbox" value="" />
                <Item label="automatic" value="automatic" />
                <Item label="manual" value="manual" />
              </Picker>
            </View>
          </Item>
          {errors.gearbox &&
            <Badge warning style={{width: '100%'}}><Text>{errors.gearbox}</Text></Badge>
          }
          <Button full onPress={modify}>
            <Text>Modify</Text>
          </Button>
          {errors.inputsError &&
            <Badge style={{width: '100%'}}><Text>{errors.inputsError}</Text></Badge>
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
