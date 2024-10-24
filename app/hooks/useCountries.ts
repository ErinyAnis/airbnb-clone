import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`,
  latlng: country.latlng,
  region: country.region,
}));

const useCountries = () => {
    console.log(formattedCountries[0].flag);
  const getAll = () => formattedCountries;

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue
  }
};

export default useCountries;