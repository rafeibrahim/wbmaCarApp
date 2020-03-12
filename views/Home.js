import React, {useState, useContext, useEffect} from 'react';
import List from '../components/List';
import {MediaContext} from '../contexts/MediaContext';
import PropTypes from 'prop-types';
import {View, Picker, Item} from 'native-base';
import {bmwModels, toyotaModels, audiModels, mercedesModels, hondaModels} from '../constants/optionsConst';

const Home = (props) => {
  const initialFilters = {
    make: 'Profile',
    model: '',
    year: 'Select Year',
    sort: '',
  };
  const {navigation} = props;
  const [filters, setFilters] = useState(initialFilters);
  const [media, setMedia] = useContext(MediaContext);

  const yearArrayConstructor = () => {
    let yearArray = ['Select Year'];
    for (let i = 2020; i > 1969; i--) {
      yearArray = [...yearArray, i];
    }
    return yearArray;
  };

  const yearList = yearArrayConstructor();
  console.log('yearList', yearList);

  const displayModelPicker = () => {
    if (filters.make === 'Profile') {
      return null;
    }

    let displayModels = [];
    if (filters.make === 'Bmw' ) {
      displayModels = bmwModels;
    } else if (filters.make === 'Toyota') {
      displayModels = toyotaModels;
    } else if (filters.make === 'Audi') {
      displayModels = audiModels;
    } else if (filters.make === 'Mercedes') {
      displayModels = mercedesModels;
    } else if (filters.make === 'Honda') {
      displayModels = hondaModels;
    }

    return <View style={{width: '100%', height: 40}}>
      <Picker
        mode="dropdown"
        selectedValue={filters.model}
        style={{width: '100%'}}
        onValueChange={(itemValue, itemIndex) => {
          console.log(itemValue);
          setFilters((filters) =>
            ({
              ...filters,
              model: itemValue,
            }));
        }
        }>
        {displayModels.map((m) => {
          return <Picker.Item
            label={m.modelLabel}
            value={m.model}
            key={(item, index) => index.toString()}/>;
        })}
      </Picker>
    </View>;
  };

  useEffect(() => {
    setMedia((mediia) => ({
      ...media,
      homeScreenFilters: filters,
    }));
  }, [filters]);

  return (
    <>
      <View style={{width: '100%', height: 40}}>
        <Picker
          selectedValue={filters.make}
          style={{width: '100%'}}
          itemStyle={{height: 44}}
          onValueChange={(itemValue, itemIndex) => {
            console.log(itemValue);
            setFilters((filters) =>
              ({
                ...filters,
                make: itemValue,
                model: '',
              }));
          }
          }>
          <Item label="Select Make" value="Profile" />
          <Item label="Audi" value="Audi" />
          <Item label="BMW" value="Bmw" />
          <Item label="Mercedes" value="Mercedes" />
          <Item label="Toyota" value="Toyota" />
          <Item label="Honda" value="Honda" />
        </Picker>
      </View>
      {displayModelPicker()}
      {/* {filters.make === 'Bmw' &&
      <Picker
        mode="dropdown"
        selectedValue={filters.model}
        style={{width: '100%'}}
        onValueChange={(itemValue, itemIndex) => {
          console.log(itemValue);
          setFilters((filters) =>
            ({
              ...filters,
              model: itemValue,
            }));
        }
        }>
        {bmwModels.map((m) => {
          return <Picker.Item label={m.modelLabel} value={m.model}/>
        })}
      </Picker>
      }
      {filters.make === 'Bmw' &&
      <Picker
        mode="dropdown"
        selectedValue={filters.model}
        style={{width: '100%'}}
        onValueChange={(itemValue, itemIndex) => {
          console.log(itemValue);
          setFilters((filters) =>
            ({
              ...filters,
              model: itemValue,
            }));
        }
        }>
        {bmwModels.map((m) => {
          return <Picker.Item label={m.modelLabel} value={m.model}/>
        })}
      </Picker>
      } */}
      <View style={{width: '100%', height: 40}}>
        <Picker
          mode="dropdown"
          selectedValue={filters.year}
          style={{width: '100%'}}
          onValueChange={(itemValue, itemIndex) => {
            console.log(itemValue);
            setFilters((filters) =>
              ({
                ...filters,
                year: itemValue,
              }));
          }
          }>
          {yearList.map((year) => {
            return <Picker.Item label={year + ''} value={year} key={(item, index) => index.toString()}/>;
          })}
        </Picker>
      </View>
      <View style={{width: '100%', height: 40}}>
        <Picker
          mode="dropdown"
          selectedValue={filters.sort}
          style={{width: '100%'}}
          onValueChange={(itemValue, itemIndex) => {
            console.log(itemValue);
            setFilters((filters) =>
              ({
                ...filters,
                sort: itemValue,
              }));
          }
          }>
          <Picker.Item label='Sort' value='' />
          <Picker.Item label='Price: Highest First' value="expensiveFirst" />
          <Picker.Item label='Price: Lowest First' value="cheapestFirst" />
          <Picker.Item label='Year: Oldest First' value="oldestCarFirst" />
          <Picker.Item label='Year: NewestFirst' value='newestCarFirst' />
          <Picker.Item label='Top Favourite' value='topFavourite' />
        </Picker>
      </View>
      <List navigation={navigation} mode={'all'}></List>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
