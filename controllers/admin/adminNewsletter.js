const Newsletter = require("../../models/Newsletter")

async function homePage(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
        res.render("admin/newsletter/index", {
            title: "Admin - Newsletter",
            data: data,
            session: req.session,
        })
    } catch (error) {

    }
}

async function editPage(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        data.active = !data.active
        await data.save()
        res.redirect(`/admin/newsletter`)
    } catch (error) {
        res.redirect("/admin/newsletter")
    }
}


async function deletePage(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.redirect("/admin/newsletter")
        }
        else
            res.redirect("/admin/newsletter")
    } catch (error) {
        res.redirect("/admin/newsletter")
    }
}

module.exports = {
    homePage: homePage,
    editPage: editPage,
    deletePage: deletePage
}