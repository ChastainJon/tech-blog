const router = require('express').Router()
const { Comment, User, Post } = require('../../models')

//Get all users
router.get('/', (req,res) =>{
    // Find all users
    User.findAll({
        //attributes: {exclude:['password']},
        attributes: ['id', 'username', 'email', 'password'],
        include: [
            {
                model: Post,
                attributes: ['id', 'title']
            },
            {
                model: Comment,
                attributes: ['id', 'text']
            }
        ]
    })
    //Return data
    .then(dbUserData => res.json(dbUserData))
    //If error return error
    .catch(err => res.status(500).json(err))
})

//Get one user
router.get('/:id', (req,res) => {
    //Find user based off ID
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title']
            },
            {
                model: Comment,
                attributes: ['id', 'comment']
            }
        ]
    })
    //Return data
    .then(dbUserData => {
        //If no user found with that id return error
        if(!dbUserData){
            res.status(404).json({Message: 'No user found with that ID'})
            return
        }
        res.json(dbUserData)
    })
    //if error return error
    .catch(err => res.status(500).json(err))
})

//Create a new user
router.post('/', (req, res) => {
    //expects Username, Email, Password in a JSON format
    User.create(req.body)
    .then(dbUserData => {
        //creates session
        req.session.save(() => {
            req.session.user_id = dbUserData.id
            req.session.username = dbUserData.username
            req.session.loggedIn = true

            //return succesful user creation
            res.json(dbUserData)
        })
    })
    //if error return error
    .catch(err => res.status(500).json(err))
})

//login
router.post('/login', (req,res) => {
    //expects email and password in JSON format
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData =>{
        //checks to see if user if found
        if(!dbUserData){
            res.status(404).json({Message: 'No user with that e-mail address'})
            return
        }

        //checks if password is correct
        const validPassword = dbUserData.checkPassword(req.body.password)

        if(!validPassword){
            res.status(400).json({Message: 'Incorrect Password'})
            return
        }

        //creates session
        req.session.save(() =>{
            req.session.user_id = dbUserData.id
            req.session.username = dbUserData.username
            req.session.loggedIn = true

            res.json({ user: dbUserData, message: 'You are now logged in!'})
        })
    })
    .catch(err => console.log(err))
})

//logout
router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() =>{
            res.status(204).end()
        })
    }else{
        res.status(404).end()
    }
})

//update a usere
router.put('/:id', (req, res) =>{
    //update user
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData =>{
        //checks to see if user found
        if(!dbUserData){
            res.status(404).json({Message: 'No user found with that ID'})
            return
        }
        //return results
        res.json(dbUserData)
    })
    //if error return error
    .catch(err => res.status(500).json(err))
})

//delete user
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {id:req.user.id}
    })
    .then(dbUserData =>{
        //check to see if actually a user
        if(!dbUserData){
            res.status(404).json({Message: 'No user found with that ID'})
            return
        }
        res.json(dbUserData)
    })
    //if error return error
    .catch(err => res.status(500).json(err))
})

module.exports = router