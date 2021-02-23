const express = require('express');
const Joi = require('joi');
const router = express.Router();

const genres = [
    { id: 1, name: 'Action' },  
    { id: 2, name: 'Horror' },  
    { id: 3, name: 'Romance'},  
  ];



// @desc    Get all genres
// @route   GET /api/genres/
// @access  Public
router.get('/', (req, res) =>{
    //return all genres
    res.send(genres);
})


// @desc    Get a genre by id
// @route   GET /api/genres/
// @access  Public
router.get('/:id', (req, res) =>{
    //find genre
    const result = genres.find( gen => gen.id === parseInt(req.params.id));
    if(!result) res.status(404).send(`Genre with ID: ${req.params.id} was not found`)
    res.send(result)
})


// @desc    Post a new genre
// @route   POST /api/genres
// @access  Public
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) =>{
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
router.delete('/:id', (req, res) =>{
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


module.exports = router;