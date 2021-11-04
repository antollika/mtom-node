import {
  getSpotifyToken,
  getSpotifyTrackData,
} from './services/spotifyService';
import { findDeezerTrack } from './services/deezerService';

const spotifyTestLink =
  'https://open.spotify.com/track/698ItKASDavgwZ3WjaWjtz?si=f4ba599a7a0b476e';

const testMethod = async () => {
  await getSpotifyToken();
  getSpotifyTrackData(spotifyTestLink, (trackData) => {
    const { name } = trackData;
    const artistName = trackData.album?.artists[0].name;

    findDeezerTrack(
      name,
      (result) => {
        console.log(result.link);
      },
      artistName
    );
  });
};

testMethod();
