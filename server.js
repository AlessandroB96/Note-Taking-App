const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { nextTick } = require('process');
const notes = require('./Develop/db/db.json');
const uuid = require('./Develop/helpers/uuid'); //method for generating unique IDs 

const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./Develop/public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

//return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results)
});

let createNewNote = (body, notesArray) => {
    const note = body;

try {
    const data = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'))
    console.log(data);

    data.push(note);
    let dataString = JSON.stringify(data, null, 2)
    fs.writeFileSync('./Develop/db/db.json', dataString)
} catch (err) {
    console.error(err)
    }
};

    app.post('/api/notes', (req, res) => {
        
        console.log(req.body);
        
        const { title , text } = req.body;
        
        if (!title || !text) {

            throw new Error('Enter title and text');
        };

            const newNote1 = {
                title,
                text,
                id: uuid()
            }
            
            const response = {
                status: 'success',
                body: newNote1
            };
            console.log(response);
        
        const newNote = createNewNote(newNote1, notes);
        res.json(newNote);
    });
    
    
    app.listen(PORT, () => {
        console.log(`API server now available at http://localhost:${PORT}`);
    });
    
