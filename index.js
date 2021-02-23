// ACCESS PASSWORDS SHOULD NOT STORED IN BLANK.
// ENVIRONMENT VALUES SHOULD BE USED. See Express Advanced Topics - Configuration min 6:15

let express = require('express');
const Joi = require('joi');
const app = express();
const config = require('config');
const morgan = require('morgan');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const logger = require('./logger');
const auth = require('./auth');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));
app.use(logger);
app.use(auth);


//configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));


if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled');
}
// db work.
dbDebugger('Connected to the database...');


const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance'},  
  ];


app.get('/', (req, res) =>{
    res.render('index', {title: 'my express app', message:' hello world!!!'})
});

// @desc    Get all genres
// @route   GET /api/genres/
// @access  Public
app.get('/api/genres', (req, res) =>{
    //return all genres
    res.send(genres);
})


// @desc    Get a genre by id
// @route   GET /api/genres/
// @access  Public
app.get('/api/genres/:id', (req, res) =>{
    //find genre
    const result = genres.find( gen => gen.id === parseInt(req.params.id));
    if(!result) res.status(404).send(`Genre with ID: ${req.params.id} was not found`)
    res.send(result)
})


// @desc    Post a new genre
// @route   POST /api/genres
// @access  Public
app.post('/api/genres', (req, res) => {
    //validate genre
    const { error } = validateGenre(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //ompose the genre to be pussed to the array
    genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    //add genre to array and return response
    genres.push(genre);
    res.send(genre);
    
})


// @desc    Update a genre by id
// @route   PUT /api/genres/id
// @access  Public
app.put('/api/genres/:id', (req, res) =>{
    //find genre
    const result = genres.find( gen => gen.id === parseInt(req.params.id));
    if(!result) return res.status(404).send(`Genre with ID: ${req.params.id} was not found`);

    //validate new data
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //update
    result.name = req.body.name;
    res.send(result);
})


// @desc    Delete a genre by id
// @route   DELETE /api/genres/id
// @access  Public
app.delete('/api/genres/:id', (req, res) =>{
    //find genre
    const result = genres.find( gen => gen.id === parseInt(req.params.id))
    if(!result) return res.status(400).send(`Genre with ID: ${req.params.id} was not found`);

    //delete it
    const index = genres.indexOf(result);
    genres.splice(index, 1);
    res.send(`deleted genre with ID: ${result.id} and name: ${result.name}`);
})


function validateGenre(genre){
    const schema = Joi.object({name: Joi.string().min(3).required()});
    return schema.validate(genre);
}



