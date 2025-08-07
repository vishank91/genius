const fs = require("fs")
const Event = require("../../models/Event")
const Newsletter = require("../../models/Newsletter")

const mailer = require("../../mailer/index")

async function homePage(req, res) {
    try {
        let data = await Event.find().sort({ _id: -1 })
        res.render("admin/events/index", {
            title: "Admin - Events",
            data: data,
            session: req.session,
        })
    } catch (error) {

    }
}

function createPage(req, res) {
    res.render("admin/events/create", {
        title: "Admin - Create Events",
        errorMessage: {},
        data: {}
    })
}

async function storePage(req, res) {
    try {
        // console.log(req.body)
        var data = new Event(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        data.createBy = "Admin"
        await data.save()

        let newsletterData = await Newsletter.find()
        newsletterData.forEach(item => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: item.email,
                subject: `Checkout Latest Event - ${process.env.SITE_NAME}`,
                html: `
                            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                                <h2 style="color: #007BFF; text-align: center;">New Event at ${process.env.SITE_NAME}</h2>

                                <p style="font-size: 16px; color: #333;">
                                Dear Guardian,
                                </p>

                                <p style="font-size: 15px; color: #333; line-height: 1.6;">
                                We are excited to inform you about an upcoming event at <strong>${process.env.SITE_NAME}</strong> that your child, can participate in!
                                </p>

                                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007BFF; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Event Name:</strong> ${data.title}</p>
                                <p style="margin: 5px 0;"><strong>Date:</strong> ${(new Date(data.date)).toLocaleString()}</p>
                                <p style="margin: 5px 0;"><strong>Venue:</strong> ${process.env.SITE_NAME},${process.env.SITE_ADDRESS}</p>
                                </div>

                                <p style="font-size: 15px; color: #333;">
                                ${data.shortDescription}
                                for More Click Here ${process.env.SITE_URL}/event
                                </p>

                                <p style="font-size: 15px; color: #333; margin-top: 20px;">
                                We highly encourage your child’s participation. For any questions or confirmation, feel free to reach out to us.
                                </p>

                                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                                Warm regards,<br>
                                <strong>${process.env.SITE_NAME} Team</strong>
                                </p>

                                <p style="font-size: 12px; color: #aaa; text-align: center; margin-top: 40px;">
                                &copy; ${(new Date()).getFullYear()} ${process.env.SITE_NAME}. All rights reserved.
                                </p>

                            </div>
                                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
        })
        res.redirect("/admin/event")
    } catch (error) {
        // console.log(error)
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }


        let errorMessage = {}
        error.errors?.title ? errorMessage.title = error.errors.title.message : ""
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : ""
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : ""
        error.errors?.date ? errorMessage.date = error.errors.date.message : ""
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : ""

        res.render("admin/events/create", {
            title: "Admin - Create Events",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }

}
async function showPage(req, res) {
    try {
        let data = await Event.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/events/show", {
                title: `Admin - Show Event`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/event")
    } catch (error) {
        res.redirect("/admin/event")
    }
}

async function editPage(req, res) {
    try {
        let data = await Event.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/events/edit", {
                title: `Admin - Edit Event`,
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/event")
    } catch (error) {
        res.redirect("/admin/event")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Event.findOne({ _id: req.params._id })
        if (data) {
            data.title = req.body.title
            data.shortDescription = req.body.shortDescription
            data.longDescription = req.body.longDescription
            data.date = req.body.date
            data.active = req.body.active
            data.updateBy.push({ name: "Admin", date: new Date() })
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
            res.redirect("/admin/event")
        }
        else
            res.redirect("/admin/event")
    } catch (error) {
        // console.log(error)
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.title ? errorMessage.title = error.errors.title.message : ""
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : ""
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : ""
        error.errors?.date ? errorMessage.date = error.errors.date.message : ""
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : ""

        res.render("admin/events/edit", {
            title: "Admin - Edit Events",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}
async function deletePage(req, res) {
    try {
        let data = await Event.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
            res.redirect("/admin/event")
        }
        else
            res.redirect("/admin/event")
    } catch (error) {
        res.redirect("/admin/event")
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