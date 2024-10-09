import auth from '../routes/auth.js'
import user from '../routes/user.js'
import books from '../routes/books.js'
import borrow from '../routes/borrow.js'
import notification from '../routes/notification.js'

const routes = (app) => {
  app.use('/api/auth', auth);
  app.use('/api/user', user);
  app.use('/api/books', books);
  app.use('/api/', borrow);
  app.use('/api/notification', notification);
}

export default routes;
