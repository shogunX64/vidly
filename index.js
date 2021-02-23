// ACCESS PASSWORDS SHOULD NOT STORED IN BLANK.
// ENVIRONMENT VALUES SHOULD BE USED. See Express Advanced Topics - Configuration min 6:15

let express = require('express');
const app = express();
const genres = require('./routes/genres');


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));


app.use(express.json());
app.use('/api/genres', genres);






