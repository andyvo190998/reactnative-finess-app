const express = require('express')
const cors = require('cors')
const dotEnv = require('dotenv')
const app = express()
const port = 5000

const ENV = dotenv.config().parsed
const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})