const SERVER_PORT = process.env.PORT || 4000;
const express = require("express");
const cors = require("cors");

// get the full list of albums
const albumsData = require("./albums");

const app = express();

app.use(express.json());
app.use(cors());

// Get an ID number that hasn't already been used in albums
function newID() {
  // Get list of IDs
  let ids = albumsData.map((el) => el.albumId).sort();
  let nextId = 1;
  // check if id string is taken
  while (ids.includes(`${nextId}`)) {
    nextId++;
  }
  return String(nextId);
}

app.get("/albums", (req, res) => {
  res.status(200).send(albumsData);
});

app.post("/albums/", (req, res) => {
  const newAlbum = {
    id: newID(),
    albumId: req.body.albumId,
    artistName: req.body.artistName,
    collectionName: req.body.collectionName,
    artworkUrl100: req.body.artworkUrl100,
    releaseDate: req.body.releaseDate,
    primaryGenreName: req.body.primaryGenreName,
    url: req.body.url,
  };

  albumsData.push(newAlbum);
  res.status(201).json({ Success: true });
});

app.get("/albums/search", (req, res) => {
  const searchTerm = req.query.artistName.toUpperCase();

  const filteredAlbums = albumsData.filter(
    (album) => album.artistName.toUpperCase() === searchTerm
  );

  res.status(200).json(filteredAlbums);
});

app.get("/albums/:id", (req, res) => {
  const id = req.params.id;

  const filteredAlbum = albumsData.find((album) => album.albumId === id);
  res.status(200).send(filteredAlbum);
});

app.delete("/albums/:id", (req, res) => {
  const id = req.params.id;
  const albumIndex = albumsData.findIndex((albums) => albums.albumId === id);

  if (albumIndex >= 0) {
    albumsData.splice(albumIndex, 1);
    res.status(200).json({ Success: true });
  } else {
    res.status(204).json({ Success: false });
  }
});

app.put("/albums/:id", (req, res) => {
  const id = req.params.id;

  const albumIndex = albumsData.findIndex((album) => album.albumId === id);

  if (albumIndex >= 0) {
    albumsData[albumIndex] = req.body;
    res.status(200).json({ Success: true });
  } else {
    res.status(404).json({ Success: false });
  }
});

app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`));
