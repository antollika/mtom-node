import express from 'express';
import { getSpotifyToken } from './services/spotifyService';
import trackConvertRoutes from './routes/track.convert.routes';

const spotifyTestLink =
  'https://open.spotify.com/track/698ItKASDavgwZ3WjaWjtz?si=f4ba599a7a0b476e';

const app = express();

app.use('/api/track-convert', trackConvertRoutes);
app.use('/test', (req, res) => {
  res.status(200).json({ message: 'Good' });
});

const startApplication = async () => {
  await getSpotifyToken();
  app.listen(process.env.PORT || 5000, () =>
    console.log(`App running on ${process.env.PORT || 5000}`)
  );
};

startApplication();
