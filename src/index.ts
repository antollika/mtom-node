import {getSpotifyToken, getSpotifyTrackData} from './utils/spotifyService'

const spotifyTestLink =
  'https://open.spotify.com/track/698ItKASDavgwZ3WjaWjtz?si=f4ba599a7a0b476e';

const testMethod = async () => {
  await getSpotifyToken();
  getSpotifyTrackData(spotifyTestLink, result => {
    console.log(result)
  })
};

testMethod();
