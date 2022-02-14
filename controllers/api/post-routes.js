const router = require('express').Router()
const { Post, User, Comment} = require('../../models')
const withAuth = require('../../utils/auth')

//get all posts
router.get('/', (req,res) =>{
    Post.findAll({
        attributes:['id', 'title', 'text', 'user_id', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'text', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => res.status(500).json(err))
})

//get one post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: ['id', 'title', 'text', 'user_id'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'text', 'user_id'],
                include:{
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData =>{
        if(!dbPostData){
            res.status(404).json({Message: 'No post with that ID'})
            return
        }
        res.json(dbPostData)
    })
    .catch(err => res.status(500).json(err))
})

//post a post
router.post('/', withAuth, (req,res) =>{
    Post.create({
        title: req.body.title,
        text: req.body.text,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//update a post
router.put('/:id', withAuth, (req,res) =>{
    Post.update(req.body, {
        where: {id: req.params.id}
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({Message: 'No post with that ID'})
            return
        }
        res.json(dbPostData)
    })
    .catch(err => res.status(500).json(err))
})

//delete a post
router.delete('/:id', withAuth, (req,res) =>{
    Post.destroy({
        where: {id:req.params.id}
    })
    .then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({Message: 'No post with that ID'})
            return
        }
        res.json(dbPostData)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router