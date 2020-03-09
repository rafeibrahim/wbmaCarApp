import React, {useState} from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';
import {View, Picker, Item} from 'native-base';
import {bmwModels, toyotaModels, audiModels, mercedesModels, hondaModels, years, years1} from '../constants/optionsConst';

const Home = (props) => {
  // console.log('Home', props);
  // const bmwModels = [
  //   {'model': '', 'modelLabel': 'Select Model'},
  //   {'model': 'Bmw118', 'modelLabel': '118'},
  //   {'model': 'Bmw320', 'modelLabel': '320'},
  //   {'model': 'Bmw330', 'modelLabel': '330'},
  //   {'model': 'Bmw340', 'modelLabel': '340'},
  // ];
  // const toyotaModels = [
  //   {'model': '', 'modelLabel': 'Select Model'},
  //   {'model': 'ToyotaAvensis', 'modelLabel': 'Avensis'},
  //   {'model': 'ToyotaAuris', 'modelLabel': 'Auris'},
  //   {'model': 'ToyotaCorolla', 'modelLabel': 'Corolla'},
  //   {'model': 'ToyotaYaris', 'modelLabel': 'Yaris'},
  // ];
  // const audiModels = [
  //   {'model': '', 'modelLabel': 'Select Model'},
  //   {'model': 'AudiA1', 'modelLabel': 'A1'},
  //   {'model': 'AudiA2', 'modelLabel': 'A2'},
  //   {'model': 'AudiA3', 'modelLabel': 'A3'},
  //   {'model': 'AudiA4', 'modelLabel': 'A4'},
  //   {'model': 'AudiA5', 'modelLabel': 'A5'},
  //   {'model': 'AudiA6', 'modelLabel': 'A6'},
  //   {'model': 'AudiA7', 'modelLabel': 'A7'},
  // ];
  // const mercedesModels = [
  //   {'model': '', 'modelLabel': 'Select Model'},
  //   {'model': 'MercedesC200', 'modelLabel': 'C200'},
  //   {'model': 'MercedesE300', 'modelLabel': 'E300'},
  //   {'model': 'MercedesS550', 'modelLabel': 'S550'},
  //   {'model': 'MercedesA180', 'modelLabel': 'A180'},
  // ];
  // const hondaModels = [
  //   {'model': '', 'modelLabel': 'Select Model'},
  //   {'model': 'HondaAccord', 'modelLabel': 'Accord'},
  //   {'model': 'HondaCivic', 'modelLabel': 'Civic'},
  //   {'model': 'HondaClarity', 'modelLabel': 'Clarity'},
  //   {'model': 'MercedesA180', 'modelLabel': 'A180'},
  // ];
  // const years = ['1990', '1991', '1992', '1993', '1994', '1995',
  //   '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003',
  //   '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011',
  //   '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019',
  //   '2020', 'Select Year'];

  const initialFilters = {
    make: 'Profile',
    model: '',
    year: 'Select Year',
    sort: '',
  };
  const {navigation} = props;
  const [filters, setFilters] = useState(initialFilters);
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
          return <Picker.Item label={m.modelLabel} value={m.model}/>
        })}
      </Picker>
    </View>;
  };
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
          {years1.map((year) => {
            return <Picker.Item label={year} value={year}/>
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
        </Picker>
      </View>
      <List navigation={navigation} mode={'all'} filters={filters}></List>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
