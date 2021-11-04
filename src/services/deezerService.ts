import axios from 'axios';

const URL = 'https://api.deezer.com/';

export type DeezerData = {
  artist: {
    name: string;
  };
  title: string;
  type: 'track';
  link: string;
};

export const findDeezerTrack = async (
  trackName: string | number,
  artistName?: string
) => {
  const result = await axios.get(
    URL + `search?q=${trackName + ' ' + artistName}`
  );

  const returnValue = result.data.data.find(
    (item) =>
      item.type === 'track' &&
      item.title === trackName &&
      (artistName ? item.artist.name === artistName : true)
  );

  if (returnValue) {
    return returnValue;
  }
  return void 0;
};
