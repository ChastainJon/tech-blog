const router = require('express').Router()
const sequelize = require('../config/connection')
const { Post, User, Comment } = require('../models')

router.get('/', (req,res) => {
    Post.findAll({
        attributes:['id', 'title', 'text', 'user_id'],
        include: [
            {
                model: Comment,
                attributes:['id','text','post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({plain: true}))

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)})
})

router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/')
        return
    }

    res.render('login')
})

module.exports = router