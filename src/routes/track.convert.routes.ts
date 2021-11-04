import { Router } from 'express';
import {
  findSpotifyTrack,
  getSpotifyTrackData,
} from '../services/spotifyService';
import { findDeezerTrack, getDeezerTrackData } from '../services/deezerService';

const router = Router();

router.get('/get', async (req, res) => {
  const {
    query: { link },
  } = req;

  const trackLink = link.toString();

  const isSpotifyTrack = Boolean(trackLink.match(/spotify/g));
  const isDeezerTrack = Boolean(trackLink.match(/deezer/g));

  if (isSpotifyTrack) {
    const spotifyLinkData = await getSpotifyTrackData(trackLink);

    const { name } = spotifyLinkData;
    const artistName = spotifyLinkData.album?.artists[0].name;

    const deezerData = await findDeezerTrack(name, artistName);

    res.status(200).json({
      deezerLink: deezerData.link,
    });
    return;
  }

  if (isDeezerTrack) {
    const deezerTrackData = await getDeezerTrackData(trackLink);

    const spotifyTrack = await findSpotifyTrack(
      deezerTrackData.title,
      deezerTrackData.artist.name
    );

    res.status(200).json({
      spotifyTrack,
    });
    return;
  }

  res.status(404).json({
    message: 'Track is not found',
  });
});

export default router;
