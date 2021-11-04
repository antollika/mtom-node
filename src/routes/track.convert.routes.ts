import { Router } from 'express';
import { getSpotifyTrackData } from '../services/spotifyService';
import { findDeezerTrack } from '../services/deezerService';

const router = Router();

router.get('/get', async (req, res) => {
  const {
    query: { link },
  } = req;

  const spotifyLinkData = await getSpotifyTrackData(link as string);

  const { name } = spotifyLinkData;
  const artistName = spotifyLinkData.album?.artists[0].name;

  const deezerData = await findDeezerTrack(name, artistName);

  res.status(200).json({
    deezerLink: deezerData.link,
  });
});

export default router;
