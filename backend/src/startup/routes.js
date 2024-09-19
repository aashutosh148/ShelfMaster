import auth from '../routes/auth.js'
import user from '../routes/user.js'
import books from '../routes/books.js'
import borrow from '../routes/borrow.js'

const routes = (app) => {
  app.use('/api/auth', auth);
  app.use('/api/user', user);
  app.use('/api/books', books);
  app.use('/api/', borrow);
}

export default routes;
