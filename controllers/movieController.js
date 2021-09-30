const router = require('express').Router();

// it is here that the movie model is hooked up to the movieController.  This is important so the controller matches how the data is to be stored in our database (as set by the models using Sequelize).
const { MovieModel } = require('../models');

// it is here that the validate session is hooked up to the movieController.
const { validateJWT } = require('../middleware');

/*
=========================
   ADD MOVIE TO WATCH LIST
=========================
*/

router.post('/', validateJWT, async (req, res) => {
  const { user_rating, watched, comments, movie } = req.body;
  const { id } = req.user;

  const addMovie = {
    user_rating: 0,
    watched: false,
    comments: '',
    movie,
    owner_id: id,
  };

  try {
    const saveMovie = await MovieModel.create(addMovie);

    res.status(201).json({
      message: 'Movie successfully saved',
      saveMovie,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to save movie',
      error: err,
    });
  }
});

/*
=========================
   GET ALL MOVIES IN THE WATCH LIST
=========================
*/

router.get('/', async (req, res) => {
  try {
    const watchedMovies = await MovieModel.findAll();

    res.status(200).json(watchedMovies);
  } catch (err) {
    res.status(500).json({
      message: `Server error ${err}`,
    });
  }
});

/*
=========================
   SHOW ONLY WATCHED MOVIES FROM THE WATCH LIST
=========================
*/

router.get('/watched', validateJWT, async (req, res) => {
  const userId = req.user.id;

  const query = {
    where: {
      watched: true,
      owner_id: userId,
    },
    returning: true,
  };

  try {
    const watchedMovies = await MovieModel.findAll(query);

    res.status(200).json(watchedMovies);
  } catch (err) {
    res.status(500).json({
      message: `Server error ${err}`,
    });
  }
});

/*
=========================
   EDIT MOVIE INSIDE THE WATCH LIST
=========================
*/

router.put('/:id', validateJWT, async (req, res) => {
  const { user_rating, watched, comments } = req.body;

  const updateMovieSaved = {
    user_rating,
    watched,
    comments,
  };

  const movieId = req.params.id;
  const userId = req.user.id;

  const query = {
    where: {
      id: movieId,
      owner_id: userId,
    },
    returning: true,
  };

  try {
    const updated = await MovieModel.update(updateMovieSaved, query);
    res.status(200).json({
      message: 'Your saved movie has been successfully updated',
      updated,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Unable to update your movie',
      error: err,
    });
  }
});

/*
=========================
   DELETE MOVIE FROM THE WATCH LIST
=========================
*/

// validate session is used to validate that a user has access to something.  The validate session is created in the middleware folder.  For our project, our validate session was created in the file titled validate-jwt.js.

// From there, the validate-jwt.js is passed to the controllers as an object (we called it 'validateJWT').  For the controllers, in this case the movieController, we can validate that a user has permission to delete a movie.

// The 'validateJWT' is a parameter within the router that will have access to the validate-jwt.js.  From there, we have access to the 'id' where we can determine if the 'id' is validate and, if so, if it meets the query conditions to further approve access.  In this case, we want to make sure the approved user.id was the same id used to save the movie.  If so, then that user has access to delete.

router.delete('/:id', validateJWT, async (req, res) => {
  const movieId = req.params.id;
  const userId = req.user.id;

  const query = {
    where: {
      id: movieId,
      owner_id: userId,
    },
    returning: true,
  };

  try {
    const deleteMovie = await MovieModel.destroy(query);

    res.status(200).json({
      message: 'Movie in watch list has been removed from database',
      deleteMovie,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server cannot remove your saved movie from the database',
      error: err,
    });
  }
});

module.exports = router;
