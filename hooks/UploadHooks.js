import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {fetchFormData, fetchPUT, getAllMedia, getUserMedia} from './APIHooks';

const initialInputs = {
  make: '',
  model: '',
  year: '',
  mileage: '',
  gearbox: '',
};

const useUploadForm = () => {
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleModelChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        model: text,
      }));
  };

  const handleMakeChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        make: text,
        model: '',
      }));
  };

  const handleYearChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        year: text,
      }));
  };

  const handleMileageChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        mileage: text,
      }));
  };

  const handleGearboxChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        gearbox: text,
      }));
  };

  const handleRegNoChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        regNo: text,
      }));
  };

  const handlePriceChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        price: text,
      }));
  };

  const handleTitleChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: text,
      }));
  };

  const handleDescriptionChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        description: text,
      }));
  };

  const handleUpload = async (file, navigation, setMedia) => {
    const filename = file.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // fix jpg mimetype
    if (type === 'image/jpg') {
      type = 'image/jpeg';
    }

    const fd = new FormData();
    fd.append('title', inputs.title);
    fd.append('description', inputs.description);
    fd.append('file', {uri: file.uri, name: filename, type});

    console.log('FD:', fd);

    try {
      const token = await AsyncStorage.getItem('userToken');


      const resp = await fetchFormData('media', fd, token);
      console.log('upl resp', resp);
      if (resp.message) {
        const data = await getAllMedia();
        setMedia((media) =>
          ({
            ...media,
            allFiles: data,
          }));
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleModify = async (id, navigation, setMedia) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const resp = await fetchPUT('media', id, inputs, token);
      console.log('upl resp', resp);
      if (resp.message) {
        const data = await getUserMedia(token);
        setMedia((media) =>
          ({
            ...media,
            myFiles: data,
          }));
        setLoading(false);
        navigation.pop();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return {
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
    handleModify,
    inputs,
    errors,
    loading,
    setErrors,
    setInputs,
  };
};

export default useUploadForm;
