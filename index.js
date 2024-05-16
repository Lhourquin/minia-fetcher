import dotenv from "dotenv/config";
import fetch from 'node-fetch';
import express, { response } from 'express';
import cors from 'cors';
const app = express();
app.use(cors());
const PORT = 3000;

app.get('/video', async (req, res) => {

    const videoUrl = req.query.url;
    const videoId = videoUrl.split('v=')[1].split('&')[0];

    console.log(req.query)
    const apiKey = process.env.API_KEY_YT;
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails,statistics`;

    try {
        const youtubeResponse = await fetch(url);
        const youtubeData = await youtubeResponse.json();
        const desireData = {
            title : youtubeData.items[0].snippet.title,
            channelId : youtubeData.items[0].snippet.channelId,
            pusblishedAt: youtubeData.items[0].snippet.publishedAt,
            thumbnails : youtubeData.items[0].snippet.thumbnails,
            channelTitle : youtubeData.items[0].snippet.channelTitle,
            duration : youtubeData.items[0].contentDetails.duration,
            views :  youtubeData.items[0].statistics.viewsCount,
            likeCount : youtubeData.items[0].statistics.likeCount,
            favoriteCount : youtubeData.items[0].statistics.favoriteCount,
            commentCount : youtubeData.items[0].statistics.commentCount,
        };

        res.json(desireData);

    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        res.status(500).send("Server error");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
