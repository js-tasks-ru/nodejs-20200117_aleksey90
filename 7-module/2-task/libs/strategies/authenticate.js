const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  // done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
  if(!email) {
    return done(null, false, 'Не указан email');
  }
  try{
    const user = await User.findOne({email});
    if(user) {
      return done(null, user);
    } else {
      const newUser = await User.create({displayName: displayName, email: email});
      if (!newUser) {
        return done(null, false, 'Некорректный email');
      }
      return done(null, newUser);
    }
  }catch(err) {
    done(err);
  }
};
