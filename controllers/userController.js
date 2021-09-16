const router = require("express").Router();
const {UserModel} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// SIGN UP //
router.post("/register", async (req, res) => {
const {username, password} = req.body;

try {
    const User = UserModel.create({
        username,
        password: bcrypt.hashSync(password, 15)
    });

    const token = jwt.sign({id: User.id,} , process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(200).json({
        message: "Account created!",
        user: {
            username: username,
            password: bcrypt.hashSync(password, 15),
            token: token
        },
    });

} catch (err) {
    res.status(500).json({
        message: "Account creation failed!",
        error: err
    });
}
});

// LOGIN //
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });

        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "Succesfully logged in!",
                    token: token
                });
            } else {
                res.status(400).json({
                    message: "Incorrect username or password"
                });
            }
        } else {
            res.status(400).json({
                message: "Incorrect username or password"
            });
        }
    
    } catch (e) {
        res.status(500).json({
            message: "oops looks like something went wrong",
            error
        })
    }
});


module.exports = router;