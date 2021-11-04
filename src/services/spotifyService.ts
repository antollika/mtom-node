import axios, { AxiosResponse } from 'axios';

let spotifyToken = '';

const CLIENT_ID = '96b736597455448c8fdcc93e3e68516c';
const CLIENT_SECRET = 'f4d9e53f23fd416593e596b69095dbdd';

const GET_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export const getSpotifyToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const tokenResult = await axios.post(GET_TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    });

    spotifyToken = tokenResult.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

export const getSpotifyTrackData = async (link: string) => {
  const matchedTrackId = decodeURIComponent(link).match(/track\/(.+)[\s|\?]/);
  if (matchedTrackId) {
    const trackId = matchedTrackId[1];
    const result = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: 'Bearer ' + spotifyToken,
        },
      }
    );
    return result.data;
  }

  return void 0;
};

export const findSpotifyTrack = async (
  trackName: string | number,
  artistName?: string
) => {
  const query = new URLSearchParams({
    q: `${artistName} ${trackName}`,
    type: 'track',
  });
  try {
    const result = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: 'Bearer ' + spotifyToken,
      },
      params: query,
    });

    const {
      tracks: { items },
    } = result.data;

    if (items && items.length) {
      return items[0].external_urls.spotify;
    }

    return void 0;
  } catch (error) {
    console.log(error);
  }
};
