import express from 'express';
import { getSpotifyToken } from './services/spotifyService';
import trackConvertRoutes from './routes/track.convert.routes';

const spotifyTestLink =
  'https://open.spotify.com/track/698ItKASDavgwZ3WjaWjtz?si=f4ba599a7a0b476e';

const app = express();
const HOST = 5000;

app.use('/api/track-convert', trackConvertRoutes);

const startApplication = async () => {
  await getSpotifyToken();
  app.listen(HOST, () => console.log(`App running on ${HOST}`));
};

startApplication();
