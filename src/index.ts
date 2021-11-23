import express from 'express';
import trackConvertRoutes from './routes/track.convert.routes';

const app = express();

app.use('/api/track-convert', trackConvertRoutes);
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  next();
});

const startApplication = () => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`App running on ${process.env.PORT || 5000}`)
  );
};

startApplication();
