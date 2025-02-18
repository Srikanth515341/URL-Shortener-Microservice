const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("URL Shortener Microservice is running!");
  });
  

const urlDatabase = {}; // In-memory storage for URL mappings
let counter = 1;

// POST: Create a short URL
app.post("/api/shorturl", (req, res) => {
    console.log("Received request at /api/shorturl");
    console.log("Request Body:", req.body); // Debugging line
  
    const { url } = req.body;
    try {
      const hostname = new URL(url).hostname;
      dns.lookup(hostname, (err) => {
        if (err) {
          return res.json({ error: "invalid url" });
        }
        
        const shortUrl = counter++;
        urlDatabase[shortUrl] = url;
        res.json({ original_url: url, short_url: shortUrl });
      });
    } catch {
      res.json({ error: "invalid url" });
    }
  });
  
  

// GET: Redirect to original URL
app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found for given input" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
