const bcrypt = require('bcrypt')

module.exports = {
    register: async (req,res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        let user = await db.check_user(username)

        if(user[0]) {
            return res.status(400).send('Email already exists')
        }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        let newUser = await db.register_user(username, hash)

        req.session.user = newUser[0];
        delete req.session.user.password
        res.status(201).send(req.session.user)
    }
}