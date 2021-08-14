import jwt from 'jsonwebtoken';
const checkLogin = (req, res, next) => {
  const cookie = req.cookies;
  const userCred = cookie.user_cad;
  if (!userCred) {
    req.user = null;
    res.locals.user = null;
    res.redirect('/user/login');
    return;
  }
  try {
    const decode = jwt.verify(userCred, process.env.JWT_SECRET);
    const user = {
      user_id: decode.user_id,
      user_email: decode.user_email,
    };
    req.user = user;
    res.locals.user = user;
    next();
    return;
  } catch (error) {
    req.user = null;
    res.locals.user = null;
    console.log('this error from check login');
    console.log(error);
    res.redirect('/user/login');
    return;
  }
};
export default checkLogin;
