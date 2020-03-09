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
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import useUploadForm from '../hooks/UploadHooks';
import {MediaContext} from '../contexts/MediaContext';
import {validateField} from '../utils/validation';
import {uploadConstraints} from '../constants/validationConst';
import {bmwModels, toyotaModels, audiModels, mercedesModels, hondaModels, years, years1, mileageList, gearboxList} from '../constants/optionsConst';
import {getAdsByTag} from '../hooks/APIHooks';
const deviceHeight = Dimensions.get('window').height;

const Upload = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [imageProfile, setImageProfile] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [send, setSend] = useState(true);

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
    handleUpload,
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

  const reset = () => {
    setErrors({});
    setInputs({});
    setImageProfile(null);
  };

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const pickImage = async (imageName) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      exif: true,
    });

    console.log(result);

    if (!result.cancelled) {
      if (imageName === 'profileImage') {
        setImageProfile(result);
      } else if (imageName === 'image2') {
        setImage2(result);
      } else if (imageName === 'image3') {
        setImage3(result);
      } else if (imageName === 'image4') {
        setImage4(result);
      } else if (imageName === 'image5') {
        setImage5(result);
      }
    }
  };

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

  const handleTitle = (text) => {
    handleTitleChange(text);
    validate('title', text);
  };

  // const handleDescription = (text) => {
  //   handleDescriptionChange(text);
  //   validate('description', text);
  // };

  const checkPhotoError = (field, image) => {
    if (image === null) {
      setErrors((errors) => ({
        ...errors,
        [field]: 'Please upload photo',
      }));
      return false;
    }
    setErrors((errors) => ({
      ...errors,
      [field]: undefined,
    }));
    return true;
  };

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

  const regNoAvailable = async (regNo) => {
    console.log('regNo to check', regNo);
    const adsArray = await getAdsByTag(regNo);
    console.log('adsArrayBYregCheck', adsArray);
    if (adsArray.length === 0) {
      return true;
    } else {
      setErrors((errors) => ({
        ...errors,
        regNoError: 'Reg No already registered',
      }));
      return false;
    }
  };


  const upload = async () => {
    const regNoOK = validate('regNo', inputs.regNo);
    const priceOK = validate('price', inputs.price);
    const makeOK = checkPickerError('make', inputs.make);
    const modelOK = checkPickerError('model', inputs.model);
    const yearOK = checkPickerError('year', inputs.year);
    const mileageOK = checkPickerError('mileage', inputs.mileage);
    const gearboxOK = checkPickerError('gearbox', inputs.gearbox);
    const imageProfileOK = checkPhotoError('imageProfile', imageProfile);
    const image2OK = checkPhotoError('image2', image2);
    const image3OK = checkPhotoError('image3', image3);
    const image4OK = checkPhotoError('image4', image4);
    const image5OK = checkPhotoError('image5', image5);
    let regNoStatusOK = false;
    if (regNoOK) {
      regNoStatusOK = await regNoAvailable(inputs.regNo);
    }

    if (regNoOK || priceOK || makeOK || modelOK || yearOK || mileageOK || gearboxOK || imageProfileOK || image2OK || image3OK || image4OK || image5OK) {
      setErrors((errors) => ({
        ...errors,
        inputsError: 'One or more fields require your attention',
      }));
    }
    console.log('reg field errors', errors);
    if (regNoOK && priceOK && makeOK && modelOK && yearOK && mileageOK && gearboxOK && imageProfileOK && image2OK && image3OK && image4OK && image5OK && regNoStatusOK) {
      console.log('upload btn working');
      // handleUpload(imageProfile, props.navigation, setMedia);
      // reset();
    } else {
      console.log('upload btn not working');
    }
  };

  const checkErrors = () => {
    console.log('errors', errors);
    if (errors.title !== undefined ||
      errors.description !== undefined) {
      setSend(false);
    } else {
      setSend(true);
    }
  };

  useEffect(() => {
    //checkErrors();
    console.log('errors from useEffect', errors);
  }, [errors]);

  useEffect(() => {
    checkPhotoError('imageProfile', imageProfile);
    checkPhotoError('image2', image2);
    checkPhotoError('image3', image3);
    checkPhotoError('image4', image4);
    checkPhotoError('image5', image5);
  }, [imageProfile, image2, image3, image4, image5]);

  console.log('send', send);

  return (
    <Content>
      {loading ? (
        <Spinner/>
      ) : (
        <Form>
          <Item>
            <FormTextInput
              placeholder='Reg. No.'
              onChangeText={handleRegNo}
              value={inputs.regNo}
              error={errors.regNo}
            />
          </Item>
          <Item>
            <FormTextInput
              placeholder='Price'
              onChangeText={handlePrice}
              value={inputs.price}
              error={errors.price}
            />
          </Item>
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
                  return <Picker.Item label={year} value={year}/>
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
                  return <Picker.Item label={mileage} value={mileage}/>
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
                <Item label="Automatic" value="Automatic" />
                <Item label="Manual" value="Manual" />
              </Picker>
            </View>
          </Item>
          {errors.gearbox &&
            <Badge warning style={{width: '100%'}}><Text>{errors.gearbox}</Text></Badge>
          }
          {/* <Item>
            <FormTextInput
              placeholder='Title'
              onChangeText={handleTitle}
              value={inputs.title}
              error={errors.title}
            />
          </Item>
          <Item>
            <FormTextInput
              placeholder='Description'
              onChangeText={handleDescription}
              value={inputs.description}
              error={errors.description}
            />
          </Item> */}
          {imageProfile &&
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{uri: imageProfile.uri}}
            style={{width: '100%', height: deviceHeight / 3}}/>
          </View>
          }
          <Button style={{borderWidth: 1, borderColor: 'black', marginTop: 2}} full onPress={() => pickImage('profileImage')}>
            <Text>Select Photo 1 (Profile)</Text>
          </Button>
          {errors.imageProfile &&
            <Badge style={{width: '100%'}}><Text>{errors.imageProfile}</Text></Badge>
          }
          {image2 &&
          <Image source={{uri: image2.uri}}
            style={{width: '100%', height: deviceHeight / 3}}/>
          }
          <Button style={{borderWidth: 1, borderColor: 'black', marginTop: 2}} full onPress={() => pickImage('image2')}>
            <Text>Select Photo 2</Text>
          </Button>
          {errors.image2 &&
            <Badge style={{width: '100%'}}><Text>{errors.image2}</Text></Badge>
          }
          {image3 &&
          <Image source={{uri: image3.uri}}
            style={{width: '100%', height: deviceHeight / 3}}/>
          }
          <Button style={{borderWidth: 1, borderColor: 'black', marginTop: 2}} full onPress={() => pickImage('image3')}>
            <Text>Select Photo 3</Text>
          </Button>
          {errors.image3 &&
            <Badge style={{width: '100%'}}><Text>{errors.image3}</Text></Badge>
          }
          {image4 &&
          <Image source={{uri: image4.uri}}
            style={{width: '100%', height: deviceHeight / 3}}/>
          }
          <Button style={{borderWidth: 1, borderColor: 'black', marginTop: 2}} full onPress={() => pickImage('image4')}>
            <Text>Select Photo 4</Text>
          </Button>
          {errors.image4 &&
            <Badge style={{width: '100%'}}><Text>{errors.image4}</Text></Badge>
          }
          {image5 &&
          <Image source={{uri: image5.uri}}
            style={{width: '100%', height: deviceHeight / 3}}/>
          }
          <Button style={{borderWidth: 1, borderColor: 'black', marginTop: 2}} full onPress={() => pickImage('image5')}>
            <Text>Select Photo 5</Text>
          </Button>
          {errors.image5 &&
            <Badge style={{width: '100%'}}><Text>{errors.image5}</Text></Badge>
          }
          <Button style={{borderWidth: 1, borderColor: 'black', marginTop: 2}} full success onPress={upload}>
            <Text>Post Ad</Text>
          </Button>
          {errors.inputsError &&
            <Badge style={{width: '100%'}}><Text>{errors.inputsError}</Text></Badge>
          }
          {errors.regNoError &&
            <Badge style={{width: '100%'}}><Text>{errors.regNoError}</Text></Badge>
          }
          <Button
            style={{borderWidth: 1, borderColor: 'black', marginTop: 2}}
            dark
            full
            onPress={reset}>
            <Text>Reset form</Text>
          </Button>
        </Form>
      )}
    </Content>
  );
};

// proptypes here
Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
