import axios from 'axios';
import xml2js from 'xml2js';

const URL = 'https://api.deezer.com/';

export type DeezerData = {
  artist: {
    name: string;
  };
  title: string;
  type: 'track';
  link: string;
};

export const getDeezerTrackData = async (link: string) => {
  const result = await axios.get(link);
  const trackIdMatch = result.data.match(/track\/(\d+)/);
  const trackId = trackIdMatch ? trackIdMatch[1] : 0;

  if (trackId) {
    const trackData = await axios.get(
      `https://api.deezer.com/track/${trackId}`
    );

    return trackData.data;
  }

  return void 0;
};

export const findDeezerTrack = async (
  trackName: string | number,
  artistName?: string
) => {
  const query = new URLSearchParams({
    q: trackName + ' ' + artistName,
  });
  const result = await axios.get(URL + `search`, { params: query });

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
