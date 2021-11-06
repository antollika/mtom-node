import { Router } from 'express';
import {
  findSpotifyTrack,
  getSpotifyToken,
  getSpotifyTrackData,
} from '../services/spotifyService';
import { findDeezerTrack, getDeezerTrackData } from '../services/deezerService';

const router = Router();

router.get('/get', async (req, res) => {
  const {
    query: { link = '' },
  } = req;

  const trackLink = link.toString();

  const isSpotifyTrack = Boolean(trackLink.match(/spotify/g));
  const isDeezerTrack = Boolean(trackLink.match(/deezer/g));

  if (isSpotifyTrack) {
    try {
      await getSpotifyToken();
      const spotifyLinkData = await getSpotifyTrackData(trackLink);

      if (!spotifyLinkData) {
        res.status(400).json({
          message: 'Track is not found',
        });
        return;
      }

      const { name } = spotifyLinkData;
      const artistName = spotifyLinkData.album?.artists[0].name;

      const deezerData = await findDeezerTrack(name, artistName);

      if (!deezerData) {
        res.status(400).json({
          message: 'Track is not found',
        });
        return;
      }

      res.status(200).json(deezerData);
    } catch (error) {
      res.status(400).json({
        message: 'Track is not found',
        error,
      });
    }
    return;
  }

  if (isDeezerTrack) {
    try {
      const deezerTrackData = await getDeezerTrackData(trackLink);

      if (!deezerTrackData) {
        res.status(400).json({
          message: 'Track is not found',
        });
        return;
      }

      await getSpotifyToken();
      const spotifyData = await findSpotifyTrack(
        deezerTrackData.title,
        deezerTrackData.artist.name
      );

      if (!spotifyData) {
        res.status(400).json({
          message: 'Track is not found',
        });
        return;
      }

      res.status(200).json(spotifyData);
    } catch (error) {
      res.status(400).json({
        message: 'Track is not found',
        error,
      });
    }
    return;
  }

  res.status(404).json({
    message: 'Track is not found',
  });
});

export default router;
