const ContactUs = require("../../models/ContactUs")

async function homePage(req, res) {
    try {
        let data = await ContactUs.find().sort({ _id: -1 })
        res.render("admin/contactus/index", {
            title: "Admin - ContactUs",
            data: data,
            session: req.session,
        })
    } catch (error) {

    }
}

async function editPage(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        data.active = !data.active
        await data.save()
        res.redirect(`/admin/contactus/show/${data._id}`)
    } catch (error) {
        res.redirect("/admin/contactus")
    }
}
async function showPage(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/contactus/show", {
                title: `Admin - Show ContactUs`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/contactus")
    } catch (error) {
        res.redirect("/admin/contactus")
    }
}


async function deletePage(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.redirect("/admin/contactus")
        }
        else
            res.redirect("/admin/contactus")
    } catch (error) {
        res.redirect("/admin/contactus")
    }
}

module.exports = {
    homePage: homePage,
    editPage: editPage,
    showPage: showPage,
    deletePage: deletePage
}