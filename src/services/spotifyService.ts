import axios from 'axios';
import fs from 'fs';
import path from 'path';

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
  const matchedTrackId = decodeURIComponent(link).match(/track\/(\w+)/);
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
      const {
        external_urls: { spotify },
        artists,
        name: trackName,
        external_ids: { isrc },
        album: { images },
      } = items[0];
      const { name } = artists[0];
      const { url: imageUrl } = images[0];

      const base64 = fs.readFileSync(
        path.join(__dirname, '../public/service_images/spotify_image.png'),
        {
          encoding: 'base64',
        }
      );

      const songData = {
        trackLink: spotify,
        artist: name,
        trackName,
        imageUrl,
        serviceName: 'Spotify',
        serviceLogo: base64,
      };

      return songData;
    }

    return void 0;
  } catch (error) {
    console.log(error);
  }
};
