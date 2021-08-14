import bcrypt from 'bcrypt';
const emailVali = (email) => {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};

const hashPassword = (pass) => {
  const slt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pass, slt);
  return hash;
};

const checkPassword =async (userpass, datapass) => {
  return await bcrypt.compare(userpass, datapass);
}

export { emailVali, hashPassword, checkPassword };

