const router = require('express').Router()
const {User, Comment, Post} = require('../../models')
const withAuth = require('../../utils/auth')

//get all comments
router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ['comment_id', 'text', 'user_id', 'post_id'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Post,
                attributes: ['post_id', 'title'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.json(err))
})

//post a comment
router.post('/', withAuth, (req, res) =>{
    Comment.create(req.body)
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.json(err))
})

//delete a comment
router.delete('/:id', withAuth, (req, res) =>{
    Comment.destroy({
        where: {id: req.params.id}
    })
    .then(dbCommentData =>{
        if(!dbCommentData){
            res.status(404).json({Message: 'No comment was found with this ID'})
            return
        }
        res.json(dbCommentData)
    })
    .catch(err => res.status(500).json(err))
})

module.exports = router