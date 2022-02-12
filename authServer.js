require('dotenv').config()

const express =  require('express')
const jwt =  require('jsonwebtoken')
const app= express() 

app.use(express.json())

//This should be stored in a db
let refreshTokens = []

//Verifies refreshTokens to make sure that there is no null token and that there are refreshTokens in the array
app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })
})

//Make sure the refreshtoken is not equal to the passed token
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

//Authenticate user
app.post('/login', (req, res) => {

    const username = req.body.username
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

//Generates token for user that expires
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10min'})
}

//listens to application running on port 3000
app.listen(4000)