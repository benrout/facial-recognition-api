const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_KEY_CLARIFAI
});

const handleAPICall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageURL)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json(err))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to retrieve user score'))
}

module.exports = {
    handleImage: handleImage,
    handleAPICall: handleAPICall
}