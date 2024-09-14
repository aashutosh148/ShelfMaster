import auth from '../routes/auth.js'
import user from '../routes/user.js'

const routes = (app) => {
  app.use('/api/auth', auth);
  app.use('/api/user', user);
}

export default routes;
