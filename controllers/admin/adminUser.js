const passwordValidator = require("password-validator")
const bcrypt = require("bcrypt")

const User = require("../../models/User")


var schema = new passwordValidator();
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

async function homePage(req, res) {
    try {
        let data = await User.find().sort({ sortOrder: 1 })
        res.render("admin/user/index", {
            title: "Admin - User",
            data: data,
            session: req.session,
        })
    } catch (error) {

    }
}

function createPage(req, res) {
    res.render("admin/user/create", {
        title: "Admin - Create User",
        errorMessage: {},
        data: {},
        session: req.session,
    })
}

async function storePage(req, res) {
    var data = new User(req.body)
    if (req.body.password === req.body.cpassword) {
        if (schema.validate(req.body.password)) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    console.log(error)
                else {
                    try {
                        data.createBy = "Admin"
                        data.password = hash
                        await data.save()
                        res.redirect("/admin/user")
                    } catch (error) {
                        // console.log(error)
                        let errorMessage = {}
                        error.keyValue?.username ? errorMessage.username = "Username Already Taken" : ""
                        error.keyValue?.email ? errorMessage.email = "Email Address Already Taken" : ""
                        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
                        error.errors?.username ? errorMessage.username = error.errors.username.message : ""
                        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
                        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""
                        error.errors?.password ? errorMessage.password = error.errors.password.message : ""

                        res.render("admin/user/create", {
                            title: "Admin - Create User",
                            errorMessage: errorMessage,
                            data: data
                        })
                    }
                }
            })
        }
        else {
            let errorMessage = {
                password: "Invalid Password. Password Length Must Be 8-100 Character, Should Contain Atleast 1 Upper Case Character, 1 Lower Case Character, 1 Digit, and 1 Special Character"
            }
            res.render("admin/user/create", {
                title: "Admin - Create User",
                errorMessage: errorMessage,
                data: data,
                session: req.session,
            })
        }
    }
    else {
        let errorMessage = {
            password: "Password and Confirm Password Doesn't Macthed"
        }
        res.render("admin/user/create", {
            title: "Admin - Create User",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }

}
async function showPage(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/user/show", {
                title: `Admin - Show User`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/user")
    } catch (error) {
        res.redirect("/admin/user")
    }
}

async function editPage(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/user/edit", {
                title: `Admin - Edit User`,
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/user")
    } catch (error) {
        res.redirect("/admin/user")
    }
}

async function updatePage(req, res) {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.username = req.body.username
            data.email = req.body.email
            data.phone = req.body.phone
            data.role = req.body.role
            data.active = req.body.active
            await data.save()
            res.redirect("/admin/user")
        }
        else
            res.redirect("/admin/user")
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        error.keyValue?.username ? errorMessage.username = "Username Already Taken" : ""
        error.keyValue?.email ? errorMessage.email = "Email Address Already Taken" : ""
        error.errors?.name ? errorMessage.name = error.errors.name.message : ""
        error.errors?.username ? errorMessage.username = error.errors.username.message : ""
        error.errors?.email ? errorMessage.email = error.errors.email.message : ""
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : ""

        res.render("admin/user/edit", {
            title: "Admin - Edit User",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}
async function deletePage(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.redirect("/admin/user")
        }
        else
            res.redirect("/admin/user")
    } catch (error) {
        res.redirect("/admin/user")
    }
}

module.exports = {
    homePage: homePage,
    createPage: createPage,
    storePage: storePage,
    showPage: showPage,
    editPage: editPage,
    updatePage: updatePage,
    deletePage: deletePage
}