require('dotenv').config()

const express =  require('express')
const jwt =  require('jsonwebtoken')
const app= express() 

app.use(express.json())

const posts = [{
    username: 'kyle',
    title: 'Post 1'
}, 
{
    username: 'jim',
    title: 'Post 2'
}]

//gets or returns all of the posts inside application with request and a response variable
app.get('/posts', authenticateToken, (req, res) => {
    //posts are filtered and only returns posts that user has access to
    res.json(posts.filter(post => post.username === req.user.name))
})


//Middleware that takes a request, response and next and does 3 things.
//1. Receives a token
//2. Verify that it's the correct user
//3. Return the token
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401) //token not sent
    
    //Token gets verified
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => 
    {
        if (err) return res.sendStatus(403) //token no longer valid
        req.user = user
        next()
    })
}

//listens to application running on port 3000
app.listen(3000)