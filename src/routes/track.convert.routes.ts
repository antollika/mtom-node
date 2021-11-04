import { Router } from 'express';
import {
  findSpotifyTrack,
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

      res.status(200).json({
        deezerLink: deezerData.link,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Track is not found',
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

      const spotifyLink = await findSpotifyTrack(
        deezerTrackData.title,
        deezerTrackData.artist.name
      );

      if (!spotifyLink) {
        res.status(400).json({
          message: 'Track is not found',
        });
        return;
      }

      res.status(200).json({
        spotifyLink,
      });
    } catch (e) {
      res.status(400).json({
        message: 'Track is not found',
      });
    }
    return;
  }

  res.status(404).json({
    message: 'Track is not found',
  });
});

export default router;
