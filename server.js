const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid')

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET request to read db.json file and return saved noted as JSON.
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      res.json(parsedData)
    }
  });
});

//New note received to save to request body, add to db.json file, then return to client with unique id.
app.post('/api/notes', (req, res) => {
  const file = './db/db.json'
  const {title, text} = req.body

  if (title && text){
    const newNote = {
      title,
      text,
      id: uuid(),
    }

    //Obtain existing notes
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);

        //Add new note
        parsedData.push(newNote);

        //Write updated notes back to db.json file
        fs.writeFile(file, JSON.stringify(parsedData), (err) => {
          err ? console.error(err) : console.info(`\nData written to ${file}`)
          res.json(parsedData)
        }
        );
        }
    });
  }
})

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);