import jwt from 'jsonwebtoken';
import People from '../model/people.js';
import Url from '../model/url.js';
import compareTime from '../util/compareTime.js';
import mailSend from '../util/sendMail.js';
import { checkPassword, emailVali, hashPassword } from '../util/util.js';

const logIn = (req, res, next) => {
  res.render('login.ejs');
};

const regS = (req, res, next) => {
  res.render('regs.ejs');
};

const signInPost = async (req, res, next) => {
  const { userName, pass } = req.body;

  if (userName && pass) {
    
    await People.findOne({ user: userName }, (err, peop) => {
      if (err ) {
        const errMass = {
          massage: 'Something Error!',
        };
        res.locals.err = errMass;
        res.render('login.ejs');
        return;
      }
      if(!peop){
        const errMass = {
          massage: 'Wrong user and email.',
        };
        res.locals.err = errMass;
        res.render('login.ejs');
        return;
      }

        if (checkPassword(req.body.pass, peop.pass)) {
          const userObj = {
            user_id: peop._id,
            user_email: peop.user,
          };
          const tocken = jwt.sign(userObj, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXP,
          });
          res.cookie(process.env.COOKIE_NAME, tocken, {
            maxAge: 864000000,
            //  httpOnly: true,
            //  signed: true,
          });
          res.redirect('/user/dashboard');
        } else {
          const errMass = {
            massage: 'Wrong user and email.',
          };
          res.locals.err = errMass;
          res.render('login.ejs');
          return;
        
      }
    });
  } else {
    const errMass = {
      massage: 'Something Error!',
    };
    res.locals.err = errMass;
    res.render('login.ejs');
    return;
  }
};

const regstrationPost = async (req, res, next) => {
  const { user, pass, repass } = req.body;

  if (user !== '' && pass !== '' && pass === repass) {
    if (emailVali(user)) {
      const hashPass = await hashPassword(pass);

      const people = new People({ user: req.body.user, pass: hashPass });
      await people.save((err) => {
        if (err) {
          if (err.code === 11000) {
            const errMesage = {
              error: true,
              massage: 'This mail is already registared. Try again.',
            };
            res.locals.err = errMesage;
            res.render('regs.ejs');
          } else {
            const errMesage = {
              error: true,
              massage: 'Something error.',
            };
            res.locals.err = errMesage;
            res.render('regs.ejs');
          }
        } else {
          const { user } = people;
          const succeMass = {
            success: true,
            massage: 'Sign up successfull.',
            data: user,
          };
          res.locals.succ = succeMass;
          res.render('login.ejs');
        }
      });
    }
  } else {
    const errMesage = {
      error: true,
      massage: 'Password maybe not mached!',
    };
    res.locals.err = errMesage;
    res.render('regs.ejs');
  }
};

const dashboard = async (req, res, next) => {
  const user = req.user;
  try {
    const urls = await Url.find({ auther: req.user.user_id }, '-auther');
    res.locals.urls = urls;
    res.locals.appName = process.env.APP_URL;
    res.render('dashboard.ejs');
  } catch (error) {
    next(error);
  }
};

const deleteUrl = async (req, res, next) => {
  const id = req.params.del;
  if (id) {
    await Url.findByIdAndDelete(id, {}, (err) => {
      if (err) {
        next('error');
        return;
      }
      res.redirect('/user/dashboard');
    });
  } else {
    next('something error');
  }
};

const logout = (req, res, next) => {
  res.cookie(process.env.COOKIE_NAME, '');
  res.redirect('/user/login');
};

const resetPage = (req, res, next) => {
  res.render('resetPage.ejs');
};

const resetPost = async (req, res, next) => {
  const tocken = Math.floor(Math.random() * 1000000);
  const currentDate = new Date();
  const time = new Date(currentDate.getTime() + 20 * 60 * 1000);
  const appName = process.env.APP_URL;
  const email = req.body.email;

  if (emailVali(email)) {
    await People.findOneAndUpdate(
      { user: email },
      { token: tocken, tokenAge: time },
      { returnOriginal: false },
      (err, data) => {
        if (err) {
          res.locals.err = {
            massage: 'Something error',
          };
          res.render('resetPage.ejs');
          
        }
        if (data) {
          const url = `${appName}user/reset/pass?email=${email}&code=${tocken}`;
          
          mailSend(
            email,
            'Password reset!',
            `your password reset link is ${url} ,This is valid for 15 min.`
          );
          res.render('timeUp.ejs', {
            message: 'password reset link sended your email!',
          });
        } else {
          res.locals.err = {
            massage: 'Thsi email not registared',
          };
          res.render('resetPage.ejs');
        }
      }
    );
  } else {
    res.locals.err = {
      massage: 'invalid Email',
    };
    res.render('resetPage.ejs');
  }
};

const resetPassCode = (req, res, next) => {
  const { email, code } = req.query;
  if (email && code && emailVali(email)) {
    res.render('resetPass.ejs', { email, code });
  } else {
    res.redirect('../../user/login');
  }
};

const updataePass = async (req, res, next) => {
  const { email, tocken, pass, repass } = req.body;

  if(pass !== repass) {
    res.render('timeUp.ejs', { message: 'Password and re enter password not same.Try Again!' });
    return;
  }

  if (
    email &&
    emailVali(email) &&
    tocken &&
    pass &&
    repass &&
    pass === repass
  ) {
    await People.findOne({ user: email, token : tocken},(err, user) => {
      if(err){
        next(err);
        return;
      }

      if(user){
        if (compareTime(user.tokenAge)){
          user.pass = hashPassword(pass);
          user.save();
          res.render('timeUp.ejs', {
            message: 'password reseted!',
          });
          
        }else{
          res.render('timeUp.ejs',{message: 'This request is times up.Try Again!'});
        }
        
      }else{
        next()
      }


    });
    
  } else {
   next();
  }
};

export {
  updataePass,
  resetPassCode,
  resetPost,
  resetPage,
  logIn,
  regS,
  signInPost,
  regstrationPost,
  dashboard,
  logout,
  deleteUrl,
};

