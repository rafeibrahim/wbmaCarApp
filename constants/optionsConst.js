// file for storing options to be displayed in pickers
const bmwModels = [
  {'model': '', 'modelLabel': 'Select Model'},
  {'model': 'Bmw118', 'modelLabel': '118'},
  {'model': 'Bmw320', 'modelLabel': '320'},
  {'model': 'Bmw330', 'modelLabel': '330'},
  {'model': 'Bmw340', 'modelLabel': '340'},
];
const toyotaModels = [
  {'model': '', 'modelLabel': 'Select Model'},
  {'model': 'ToyotaAvensis', 'modelLabel': 'Avensis'},
  {'model': 'ToyotaAuris', 'modelLabel': 'Auris'},
  {'model': 'ToyotaCorolla', 'modelLabel': 'Corolla'},
  {'model': 'ToyotaYaris', 'modelLabel': 'Yaris'},
];
const audiModels = [
  {'model': '', 'modelLabel': 'Select Model'},
  {'model': 'AudiA1', 'modelLabel': 'A1'},
  {'model': 'AudiA2', 'modelLabel': 'A2'},
  {'model': 'AudiA3', 'modelLabel': 'A3'},
  {'model': 'AudiA4', 'modelLabel': 'A4'},
  {'model': 'AudiA5', 'modelLabel': 'A5'},
  {'model': 'AudiA6', 'modelLabel': 'A6'},
  {'model': 'AudiA7', 'modelLabel': 'A7'},
];
const mercedesModels = [
  {'model': '', 'modelLabel': 'Select Model'},
  {'model': 'MercedesC200', 'modelLabel': 'C200'},
  {'model': 'MercedesE300', 'modelLabel': 'E300'},
  {'model': 'MercedesS550', 'modelLabel': 'S550'},
  {'model': 'MercedesA180', 'modelLabel': 'A180'},
];
const hondaModels = [
  {'model': '', 'modelLabel': 'Select Model'},
  {'model': 'HondaAccord', 'modelLabel': 'Accord'},
  {'model': 'HondaCivic', 'modelLabel': 'Civic'},
  {'model': 'HondaClarity', 'modelLabel': 'Clarity'},
];

const engineArrayConstructor = () => {
  let engineArray = ['Select Engine Capacity'];
  for (let i = 0; i < 5.1; i = i + 0.1) {
    engineArray = [...engineArray, Number.parseFloat(i).toFixed(1)];
  }
  return engineArray;
};

const engineList = engineArrayConstructor();
// console.log('engineList', engineList);

const yearArrayConstructor = () => {
  let yearArray = ['Select Year'];
  for (let i = 2020; i > 1969; i--) {
    yearArray = [...yearArray, i];
  }
  return yearArray;
};

const yearList = yearArrayConstructor();
// console.log('yearList', yearList);

const mileageArrayConstructor = () => {
  let mileageArray = ['Select Mileage'];
  for (let i = 5000; i < 505000; i += 5000) {
    mileageArray = [...mileageArray, i];
  }
  return mileageArray;
};
const mileageList = mileageArrayConstructor();
// console.log('mileageList', mileageList);

export {bmwModels,
  toyotaModels,
  audiModels,
  mercedesModels,
  hondaModels,
  engineList,
  yearList,
  mileageList};
