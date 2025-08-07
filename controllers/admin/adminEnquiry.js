const Enquiry = require("../../models/Enquiry")

async function homePage(req, res) {
    try {
        let data = await Enquiry.find().sort({ _id: -1 })
        res.render("admin/enquiry/index", {
            title: "Admin - Enquiry",
            data: data,
            session: req.session,
        })
    } catch (error) {

    }
}

async function editPage(req, res) {
    try {
        let data = await Enquiry.findOne({ _id: req.params._id })
        data.active = !data.active
        await data.save()
        res.redirect(`/admin/enquiry/show/${data._id}`)
    } catch (error) {
        res.redirect("/admin/enquiry")
    }
}
async function showPage(req, res) {
    try {
        let data = await Enquiry.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/enquiry/show", {
                title: `Admin - Show Enquiry`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/enquiry")
    } catch (error) {
        res.redirect("/admin/enquiry")
    }
}


async function deletePage(req, res) {
    try {
        let data = await Enquiry.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.redirect("/admin/enquiry")
        }
        else
            res.redirect("/admin/enquiry")
    } catch (error) {
        res.redirect("/admin/enquiry")
    }
}

module.exports = {
    homePage: homePage,
    editPage: editPage,
    showPage: showPage,
    deletePage: deletePage
}