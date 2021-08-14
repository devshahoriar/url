import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import logInroute from './router/logReg.js';
import route from './router/main.js';



dotenv.config();
const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route);
app.use('/user', logInroute);
app.all('*', (req, res) => res.render('urlNot.ejs'));

app.use((err, req, res, next) => {
  console.log('it is comes from error js.');
  console.dir(err);
  res.render('urlNot.ejs');
});

mongoose
  .connect(
    'mongodb+srv://shuvo:asdfghjkl@cluster0.t8upl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log('Db = ok!');
    app.listen(process.env.PORT, () => {
      console.log('Server = ok!');
    });
  })
  .catch((err) => {
    console.log(err);
  });
