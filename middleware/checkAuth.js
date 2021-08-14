import jwt from 'jsonwebtoken';
const checkAuth = (req, res, next) => {
  const cookie = req.cookies;
  const userCred = cookie.user_cad;
  if (!userCred) {
    req.user = null;
    res.locals.user = null;
    next();
    return;
  } else {
    try {
      const decode = jwt.verify(userCred, process.env.JWT_SECRET);
      const user = {
        user_id: decode.user_id,
        user_email: decode.user_email,
      };
      req.user = user;
      res.locals.user = user;
      res.redirect('/user/dashboard');
      return;
    } catch (error) {
      req.user = null;
      res.locals.user = null;
      console.log('this error from check auth');
      console.log(error);
      next();
      return;
    }
  }
};
  
export default checkAuth;
