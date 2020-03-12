import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {fetchFormData, fetchPUT, getAllMedia, getAdsByTag, getAllAds, getUserMedia, postTag} from './APIHooks';

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

  const handleUpload = async (profileImageFile, image2File, image3File, image4File, image5File, navigation, setMedia) => {
    setLoading(true);
    const userFromStorage = await AsyncStorage.getItem('user');
    const uData = JSON.parse(userFromStorage);
    // {"regNo":"JKL-456","make":"Audi","model":"A6","year":2020,"engine":"2.0","fuel":"diesel","gearbox":"automatic","mileage":5000,"price"64000}
    const carAdDescriptionObject = {
      regNo: inputs.regNo,
      make: inputs.make,
      model: inputs.model,
      year: inputs.year,
      engine: '2.0',
      fuel: 'diesel',
      gearbox: inputs.gearbox,
      mileage: inputs.mileage,
      price: parseInt(inputs.price, 10),
      ownerName: uData.full_name,
      ownerEmail: uData.email,
    };

    console.log('carAdDescriptionObject', carAdDescriptionObject);

    const profileImageFilename = profileImageFile.uri.split('/').pop();
    const profileImageMatch = /\.(\w+)$/.exec(profileImageFilename);
    let profileImageType = profileImageMatch ? `image/${profileImageMatch[1]}` : `image`;
    // fix jpg mimetype
    if (profileImageType === 'image/jpg') {
      profileImageType = 'image/jpeg';
    }

    const image2Filename = image2File.uri.split('/').pop();
    const image2Match = /\.(\w+)$/.exec(image2Filename);
    let image2Type = image2Match ? `image/${image2Match[1]}` : `image`;
    // fix jpg mimetype
    if (image2Type === 'image/jpg') {
      image2Type = 'image/jpeg';
    }

    const image3Filename = image3File.uri.split('/').pop();
    const image3Match = /\.(\w+)$/.exec(image3Filename);
    let image3Type = image3Match ? `image/${image3Match[1]}` : `image`;
    // fix jpg mimetype
    if (image3Type === 'image/jpg') {
      image3Type = 'image/jpeg';
    }

    const image4Filename = image4File.uri.split('/').pop();
    const image4Match = /\.(\w+)$/.exec(image4Filename);
    let image4Type = image4Match ? `image/${image4Match[1]}` : `image`;
    // fix jpg mimetype
    if (image4Type === 'image/jpg') {
      image4Type = 'image/jpeg';
    }

    const image5Filename = image5File.uri.split('/').pop();
    const image5Match = /\.(\w+)$/.exec(image5Filename);
    let image5Type = image5Match ? `image/${image5Match[1]}` : `image`;
    // fix jpg mimetype
    if (image5Type === 'image/jpg') {
      image5Type = 'image/jpeg';
    }

    const profileImageFd = new FormData();
    profileImageFd.append('title', inputs.regNo);
    profileImageFd.append('description', JSON.stringify(carAdDescriptionObject));
    profileImageFd.append('file', {uri: profileImageFile.uri, name: profileImageFilename, type: profileImageType});
    console.log('profileImageFD:', profileImageFd);

    const image2Fd = new FormData();
    image2Fd.append('title', inputs.regNo);
    image2Fd.append('description', JSON.stringify(carAdDescriptionObject));
    image2Fd.append('file', {uri: image2File.uri, name: image2Filename, type: image2Type});
    console.log('image2Fd: ', image2Fd);

    const image3Fd = new FormData();
    image3Fd.append('title', inputs.regNo);
    image3Fd.append('description', JSON.stringify(carAdDescriptionObject));
    image3Fd.append('file', {uri: image3File.uri, name: image3Filename, type: image3Type});
    console.log('image3Fd: ', image3Fd);

    const image4Fd = new FormData();
    image4Fd.append('title', inputs.regNo);
    image4Fd.append('description', JSON.stringify(carAdDescriptionObject));
    image4Fd.append('file', {uri: image4File.uri, name: image4Filename, type: image4Type});
    console.log('image4Fd: ', image4Fd);

    const image5Fd = new FormData();
    image5Fd.append('title', inputs.regNo);
    image5Fd.append('description', JSON.stringify(carAdDescriptionObject));
    image5Fd.append('file', {uri: image5File.uri, name: image5Filename, type: image5Type});
    console.log('image3Fd: ', image5Fd);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const resp1 = await fetchFormData('media', profileImageFd, token);
      const resp2 = await fetchFormData('media', image2Fd, token);
      const resp3 = await fetchFormData('media', image3Fd, token);
      const resp4 = await fetchFormData('media', image4Fd, token);
      const resp5 = await fetchFormData('media', image5Fd, token);
      console.log('upl resp', resp1);
      if (resp1.message && resp2.message && resp3.message && resp4.message && resp5.message) {
        await postTag(resp1.file_id, 'carApp', token);
        await postTag(resp1.file_id, 'carAppProfile', token);
        await postTag(resp1.file_id, 'carApp' + inputs.make, token);
        await postTag(resp1.file_id, 'carApp' + inputs.model, token);
        await postTag(resp1.file_id, 'carApp' + inputs.regNo, token);
        await postTag(resp1.file_id, 'carApp' + uData.username, token);

        await postTag(resp2.file_id, 'carApp', token);
        await postTag(resp2.file_id, 'carApp' + inputs.regNo, token);

        await postTag(resp3.file_id, 'carApp', token);
        await postTag(resp3.file_id, 'carApp' + inputs.regNo, token);

        await postTag(resp4.file_id, 'carApp', token);
        await postTag(resp4.file_id, 'carApp' + inputs.regNo, token);

        await postTag(resp5.file_id, 'carApp', token);
        await postTag(resp5.file_id, 'carApp' + inputs.regNo, token);

        const allAdData = await getAllAds();
        // const data = await getAllMedia();
        setMedia((media) =>
          ({
            ...media,
            allAdFiles: allAdData,
          }));
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleModify = async (id, navigation, setMedia, getMedia) => {
    try {
      setLoading(true);
      const userFromStorage = await AsyncStorage.getItem('user');
      const uData = JSON.parse(userFromStorage);

      const carAdDescriptionObject = {
        regNo: inputs.regNo,
        make: inputs.make,
        model: inputs.model,
        year: inputs.year,
        engine: '2.0',
        fuel: 'diesel',
        gearbox: inputs.gearbox,
        mileage: inputs.mileage,
        price: parseInt(inputs.price, 10),
        ownerName: uData.full_name,
        ownerEmail: uData.email,
      };

      const modifyObject = {
        description: JSON.stringify(carAdDescriptionObject),
      };
      const token = await AsyncStorage.getItem('userToken');
      const resp = await fetchPUT('media', id, modifyObject, token);
      console.log('upl resp', resp);
      if (resp.message) {
        // const data = await getUserMedia(token);
        const myAdData = await getAdsByTag(uData.username);
        myAdData.forEach((ad) => {
          // console.log('ad.description', ad.description);
          ad.description = JSON.parse(ad.description);
        });
        setMedia((media) =>
          ({
            ...media,
            myFiles: myAdData,
          }));
        getMedia('updateAll');
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
