const router = require("express").Router();
const {UserModel} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateJWT } = require("../middleware");
const {UniqueConstraintError} = require("sequelize")

// SIGN UP //
router.post("/register", async (req, res) => {
const {username, password} = req.body;

try {
    const User = await UserModel.create({
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
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "Username is taken",
            error: err
        })
    } else {
        res.status(500).json({
            message: "Account creation failed!",
            error: err
        });
    }
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

//Edit Login//

router.put("/update", validateJWT, async (req, res) => {
    const {username, password} = req.body;
    const userId = req.user.id;
    
    const query ={
        where: {
            id: userId,
        }
    };

    const updatedLogin = {
        username: username,
        password: bcrypt.hashSync(password, 15),
    };
    
    try {
        const update = await UserModel.update(updatedLogin, query);
        res.status(200).json({
            
            message: "Information successfully updated!",
            updatedLogin,
            update
        });
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//Get Account
router.get("/mine", validateJWT, async (req, res) => {
    let userId = req.user.id
    try {
        const userAccount = await UserModel.findAll({
            where: {
                id: userId
            }
        });
        res.status(200).json(userAccount);
    } catch  (err) {
        res.status(500).json({
            error: err
        });
    }
});

module.exports = router;