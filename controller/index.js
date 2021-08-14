import Url from '../model/url.js';

const index = (req, res, next) => {

  res.render('index.ejs');
};

const postUrl = (req, res, next) => {
  let url = new Url({
    url: req.body.url,
    sortText: req.body.sortText,
  });
  if (req.user && req.user.user_id){
    url.auther = req.user.user_id;
  }
    url.save((err) => {
      if (err) {
        res.locals.err = true;
        res.render('index.ejs');
      } else {
        res.locals.ok = true;
        res.locals.url = process.env.APP_URL + url.sortText;
        res.render('index.ejs');
      }
    });
};

const short = async (req, res, err) => {
  let url = await Url.findOneAndUpdate(
    { sortText: req.params.url },
    { $inc: { count: 1 } },
    {
      returnOriginal: false,
    }
  );
  if (url === null) {
    res.render('urlNot.ejs');
  } else {
    res.redirect(url.url);
  }
};



export { index, postUrl, short };

