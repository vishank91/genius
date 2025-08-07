const bcrypt = require("bcrypt")
const passwordValidator = require("password-validator")

const User = require("../../models/User")
const mailer = require("../../mailer/index")

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
    let data = await User.findOne()
    res.render("admin/index", {
        title: "Admin Home",
        data: data,
        session: req.session,
    })
}
async function loginPage(req, res) {
    res.render("admin/login", {
        title: "Login Page"
    })

}
async function loginStorePage(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                req.session.login = true
                req.session.username = data.username
                req.session.name = data.name
                req.session.role = data.role
                var time = 86400000 * 15  //Miliseconds in 1 Day
                req.session.cookie.expires = new Date(Date.now() + time)
                req.session.cookie.maxAge = time
                res.redirect("/admin")
            }
            else
                res.render("admin/login", {
                    title: "Login Page",
                    show: true
                })
        }
        else {
            res.render("admin/login", {
                title: "Login Page",
                show: true
            })
        }

    }
    catch (error) {
        console.log(error)
        res.render("admin/login", {
            title: "Login Page",
            show: false
        })
    }
}

function forgetPassword1Page(req, res) {
    res.render("admin/forgetPassword1", {
        title: "Reset Password",
        show: false
    })
}
async function forgetPassword1StorePage(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username },
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8)).toString().padEnd(6, "1"))
            req.session.resetPasswordUsername = data.username
            data.passwordReset = {
                otp: otp,
                time: new Date()
            }
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `OTP for Password Reset : ${process.env.SITE_NAME}`,
                html: `
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      
                    <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
                    
                    <p style="font-size: 16px; color: #555555;">Hello ${data.name},</p>
                    
                    <p style="font-size: 16px; color: #555555;">
                        We received a request to reset your password for your ${process.env.SITE_NAME} account. Please use the OTP below to proceed with resetting your password:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 4px;">${otp}</span>
                    </div>

                    <p style="font-size: 14px; color: #777777;">
                        This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email or contact support.
                    </p>

                    <p style="font-size: 16px; color: #555555;">Thank you,<br>The ${process.env.SITE_NAME} Team</p>
                    </div>
                `
            })

            res.redirect("/admin/forget-password-2")
        }
        else {
            res.render("admin/forgetPassword1", {
                title: "Reset Password",
                show: true
            })
        }
    } catch (error) {
        res.redirect("/admin/login")
    }
}

function forgetPassword2Page(req, res) {
    res.render("admin/forgetPassword2", {
        title: "Reset Password",
        show: false
    })
}
async function forgetPassword2StorePage(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.session.resetPasswordUsername },
                { email: req.session.resetPasswordUsername },
            ]
        })
        let currentTime = new Date()
        if (data) {
            if (data.passwordReset?.otp == req.body.otp && (currentTime - data.passwordReset.time) < 600000)
                res.redirect("/admin/forget-password-3")
            else {
                res.render("admin/forgetPassword2", {
                    title: "Reset Password",
                    show: true,
                    message: "Invalid OTP Or OTP Has Been Expired, Please Try Again"
                })
            }
        }
        else {
            res.render("admin/forgetPassword2", {
                title: "Reset Password",
                show: true,
                message: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        res.redirect("/admin/login")
    }
}
function forgetPassword3Page(req, res) {
    res.render("admin/forgetPassword3", {
        title: "Reset Password",
        show: false
    })
}
async function forgetPassword3StorePage(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.session.resetPasswordUsername },
                { email: req.session.resetPasswordUsername },
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error)
                        console.log(error)
                    else {
                        data.password = hash
                        await data.save()
                        delete req.session.destroy()
                        res.redirect("/admin/login")
                    }
                })
            }
            else {
                res.render("admin/forgetPassword3", {
                    title: "Reset Password",
                    show: true,
                    message: "Invalid Password. Password Length Must Be 8-100 Character, Should Contain Atleast 1 Upper Case Character, 1 Lower Case Character, 1 Digit, and 1 Special Character"
                })
            }
        }
        else {
            res.render("admin/forgetPassword3", {
                title: "Reset Password",
                show: true,
                message: "Auauthorized Activity"
            })
        }
    } catch (error) {
        res.redirect("/admin/login")
    }
}


async function logoutPage(req, res) {
    req.session.destroy()
    res.redirect("/admin/login")
}

module.exports = {
    homePage: homePage,
    loginPage: loginPage,
    loginStorePage: loginStorePage,
    logoutPage: logoutPage,
    forgetPassword1Page: forgetPassword1Page,
    forgetPassword1StorePage: forgetPassword1StorePage,
    forgetPassword2Page: forgetPassword2Page,
    forgetPassword2StorePage: forgetPassword2StorePage,
    forgetPassword3Page: forgetPassword3Page,
    forgetPassword3StorePage: forgetPassword3StorePage,
}