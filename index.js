const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./models/BlogPost');
require('./services/passport');

const app = express();

app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require('./routes/authRoutes')(app);
require('./routes/blogPostsRoutes')(app);
require('./routes/userRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
