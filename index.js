const express = require('express');
const fs = require('fs').promises;
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

// Helper para errores 500
function handleError500(res, errorMsg) {
    return res.status(500).json({ error: errorMsg || 'Internal Server Error' });
};

// Helper para errores 404
function handleError404(res, errorMsg) {
    return res.status(404).json({ error: errorMsg || 'Source Not Found' });
};

//Create anime
app.post('/animes', async (req, res) => {
    try {
        const data = await fs.readFile('anime.json', 'utf-8');
        const animes = JSON.parse(data);
        const newId = Date.now().toString();
        animes[newId] = req.body;
        await fs.writeFile('anime.json', JSON.stringify(animes, null, 2));
        res.status(201).json(animes[newId]);
    } catch (err) {
        handleError500(res, 'Cannot Save Changes');
    }
});

//Read anime list
app.get('/animes', async (req, res) => {
    try {
        const data = await fs.readFile('anime.json', 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        handleError500(res, 'Cannot Read File');
    };
});

//Read by ID
app.get('/animes/:id', async (req, res) => {
    try {
        const data = await fs.readFile('anime.json', 'utf-8');
        const animes = JSON.parse(data);
        const anime = animes[req.params.id];
        if (!anime) return handleError404(res, 'Anime not found');
        res.json(anime);
    } catch (err) {
        handleError500(res, 'Cannot Read File');
    };
});

//Read by Name
app.get('animes/name/:name', async (req, res) => {
    try {
        const data = await fs.readFile('anime.json', 'utf-8');
        const animes = JSON.parse(data);
        const anime = Object.values(animes).find(a => a.name.toLowerCase() === req.params.name.toLowerCase());
        anime ? res.json(anime) : res.status(404).json({ error: 'Anime not found'});
    } catch (err) {
        handleError500(res, 'Cannot Read File')
    };
});

//Update anime
app.put('/animes/:id', async (req, res) => {
    try {
        const data = await fs.readFile('anime.json', 'utf-8');
        const animes = JSON.parse(data);
        if (!animes[req.params.id]) return handleError404(res, 'Anime Not Found');
        animes[req.params.id] = { ...animes[req.params.id], ...req.body };
        await fs.writeFile('anime.json', JSON.stringify(animes, null, 2));
        res.json(animes[req.params.id]);
    } catch (err) {
        handleError500(res, 'Cannot Save File');
    }
});

//Delete anime
app.delete('/animes/:id', async (req, res) => {
    try {
        const data = await fs.readFile('animes.json', 'utf-8');
        const animes = JSON.parse(data);
        if (!animes[req.params.id]) return handleError404(res, 'Anime Not Found');
        delete animes[req.params.id];
        await fs.writeFile('anime.json', JSON.stringify(animes, null, 2));
        res.json({ message: 'Anime Successfully Deleted'});
    } catch {
        res.status(500).json({ error: 'Cannot Save File'});
    };
});