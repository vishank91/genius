const Setting = require("../models/Setting")
const Team = require("../models/Team")
const Feature = require("../models/Feature")
const Testimonial = require("../models/Testimonial")
const Faq = require("../models/Faq")
const Gallery = require("../models/Gallery")
const Department = require("../models/Department")
const Event = require("../models/Event")
const Newsletter = require("../models/Newsletter")
const ContactUs = require("../models/ContactUs")
const Enquiry = require("../models/Enquiry")

const mailer = require("../mailer/index")

async function getSetting() {
    try {
        let data = await Setting.findOne()
        return data
    } catch (error) {
        return []
    }
}

async function getTeam() {
    try {
        let data = await Team.find().sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getFeature() {
    try {
        let data = await Feature.find().sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getTestimonial() {
    try {
        let data = await Testimonial.find().sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getFaq() {
    try {
        let data = await Faq.find().sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getGallery() {
    try {
        let data = await Gallery.find().sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getDepartment() {
    try {
        let data = await Department.find().sort({ sortOrder: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function getEvent() {
    try {
        let data = await Event.find().sort({ date: 1 })
        return data
    } catch (error) {
        return []
    }
}

async function homePage(req, res) {
    res.render("index", {
        title: "Home",
        currentUrl: "/",
        fact: await getSetting(),
        team: await getTeam(),
        feature: await getFeature(),
        testimonial: (await getTestimonial()).slice(0, 5),
        faq: (await getFaq()).slice(0, 3),
        gallery: await getGallery(),
        session: req.session,
    })
}

async function aboutPage(req, res) {
    res.render("aboutPage", {
        title: "About Us",
        currentUrl: "/about",
        fact: await getSetting(),
        feature: await getFeature(),
        testimonial: await getTestimonial(),
        session: req.session,
    })
}

async function featurePage(req, res) {
    res.render("featurePage", {
        title: "Features",
        currentUrl: "/feature",
        fact: await getSetting(),
        feature: await getFeature(),
        session: req.session,
    })
}

async function departmentPage(req, res) {
    let departmentData = await getDepartment()
    if (req.query._id)
        var data = await Department.findOne({ _id: req.query._id })

    if (!data)
        var data = departmentData[0]

    res.render("departmentPage", {
        title: "Department",
        currentUrl: "/department",
        fact: await getSetting(),
        team: await getTeam(),
        department: departmentData,
        testimonial: (await getTestimonial()).slice(0, 4),
        data: data,
        session: req.session,
    })
}

async function teamPage(req, res) {
    res.render("teamPage", {
        title: "Team",
        currentUrl: "/team",
        team: await getTeam(),
        session: req.session,
    })
}

async function testimonialPage(req, res) {
    res.render("testimonialPage", {
        title: "Testimonial",
        currentUrl: "/testimonial",
        testimonial: await getTestimonial(),
        session: req.session,
    })
}

async function contactUsPage(req, res) {
    res.render("contactUsPage", {
        title: "Contact-Us",
        currentUrl: "/contactus",
        show: false,
        session: req.session,
    })
}

async function contactUsStorePage(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: "Your Contact Us Query Recieved",
            html: `
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

                        <h2 style="color: #007BFF; text-align: center;">Thank You, ${data.name}!</h2>

                        <p style="font-size: 16px; color: #333;">
                        We’ve received your message and will get back to you shortly. Your trust in ${process.env.SITE_NAME} means a lot to us!
                        </p>

                        <p style="font-size: 15px; color: #333; line-height: 1.5;">
                        Here's a copy of your message for your reference:
                        </p>

                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007BFF; margin-top: 10px;">
                        <p><strong>Email:</strong>${data.email}</p>
                        <p><strong>Phone:</strong>${data.phone}</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong> ${data.message}</p>
                        </div>

                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        We’ll respond to your inquiry as soon as possible. Have a great day!
                        </p>

                        <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 40px;">&copy;  ${(new Date().getFullYear())}  ${process.env.SITE_NAME}</p>

                    </div>
                        `
        }, (error) => {
            if (error)
                console.log(error)
        })
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: "New Contact Us Query Recieved",
            html: `
                   <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

                        <h2 style="color: #dc3545;">New Contact Us Query</h2>

                        <p style="font-size: 16px; color: #333;">You’ve received a new message via the contact form:</p>

                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #dc3545; margin-top: 10px;">
                        <p><strong>Name:</strong>${data.name}</p>
                        <p><strong>Email:</strong>${data.email}</p>
                        <p><strong>Phone:</strong>${data.phone}</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong> ${data.message}</p>
                        </div>

                        <p style="font-size: 14px; color: #666; margin-top: 20px;">Please follow up as needed.</p>

                        <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 40px;">${process.env.SITE_NAME} Contact Form</p>

                    </div>
                        `
        }, (error) => {
            if (error)
                console.log(error)
        })

        res.render("contactUsPage", {
            title: "Contact-Us",
            currentUrl: "/contactus",
            show: true,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
    }
}

async function enquiryPage(req, res) {
    res.render("enquiryPage", {
        title: "Enquiry for Admission",
        currentUrl: "/enquiry",
        fact: await getSetting(),
        team: await getTeam(),
        testimonial: await getTestimonial(),
        show: false,
        session: req.session,
    })
}
async function enquiryStorePage(req, res) {
    try {
        let data = new Enquiry(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: data.email,
            subject: "Your Enquiry for Admission Recieved",
            html: `
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

                        <h2 style="color: #007BFF; text-align: center;">Thank You, ${data.name}!</h2>

                        <p style="font-size: 16px; color: #333;">
                        We’ve received your query for Admission and will get back to you shortly. Your trust in ${process.env.SITE_NAME} means a lot to us!
                        </p>

                        <p style="font-size: 15px; color: #333; line-height: 1.5;">
                        Here's a copy of your message for your reference:
                        </p>

                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007BFF; margin-top: 10px;">
                        <p><strong>Email:</strong>${data.email}</p>
                        <p><strong>Phone:</strong>${data.phone}</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong> ${data.message}</p>
                        </div>

                        <p style="font-size: 14px; color: #666; margin-top: 30px;">
                        We’ll respond to your inquiry as soon as possible. Have a great day!
                        </p>

                        <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 40px;">&copy;  ${(new Date().getFullYear())}  ${process.env.SITE_NAME}</p>

                    </div>
                        `
        }, (error) => {
            if (error)
                console.log(error)
        })
        mailer.sendMail({
            from: process.env.MAIL_SENDER,
            to: process.env.MAIL_SENDER,
            subject: "New Enquiry for Admission Recieved",
            html: `
                   <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">

                        <h2 style="color: #dc3545;">New Contact Us Query</h2>

                        <p style="font-size: 16px; color: #333;">You’ve received a new Enquiry via the enquiry form:</p>

                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #dc3545; margin-top: 10px;">
                        <p><strong>Name:</strong>${data.name}</p>
                        <p><strong>Email:</strong>${data.email}</p>
                        <p><strong>Phone:</strong>${data.phone}</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong> ${data.message}</p>
                        </div>

                        <p style="font-size: 14px; color: #666; margin-top: 20px;">Please follow up as needed.</p>

                        <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 40px;">${process.env.SITE_NAME} Enquiry Form</p>

                    </div>
                        `
        }, (error) => {
            if (error)
                console.log(error)
        })

        res.render("enquiryPage", {
            title: "Enquiry for Admission",
            currentUrl: "/enquiry",
            fact: await getSetting(),
            team: await getTeam(),
            testimonial: await getTestimonial(),
            show: true,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
    }
}

async function galleryPage(req, res) {
    res.render("galleryPage", {
        title: "Gallery",
        currentUrl: "/gallery",
        gallery: await getGallery(),
        session: req.session,
    })
}

async function faqPage(req, res) {
    res.render("faqPage", {
        title: "FAQ",
        currentUrl: "/faq",
        faq: await getFaq(),
        session: req.session,
    })
}

async function eventPage(req, res) {
    res.render("eventPage", {
        title: "Events",
        currentUrl: "/event",
        event: await getEvent(),
        session: req.session,
    })
}

async function newsletterSubscription(req, res) {
    try {
        if (req.body.email !== "") {
            let data = new Newsletter(req.body)
            await data.save()


            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: "Thanks to Subscribe Our Newsletter Service, Now We can Send Email Regarding Upcoming Events and Many More...",
                html: `
                     <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">

                        <h2 style="text-align: center; color: #007BFF; margin-bottom: 20px;">Welcome to ${process.env.SITE_NAME}!</h2>

                        <p style="font-size: 16px; color: #333;">Dear Guardian,</p>

                        <p style="font-size: 15px; color: #333; line-height: 1.6;">
                            Thank you for subscribing to our newsletter. We're thrilled to have you as part of the ${process.env.SITE_NAME} family!
                        </p>

                        <p style="font-size: 15px; color: #333; line-height: 1.6;">
                            From school events and academic achievements to cultural celebrations, you’ll now receive updates directly in your inbox.
                        </p>

                        <p style="font-size: 15px; color: #333; line-height: 1.6;">
                            If you have any questions, feel free to reach out to us anytime.
                        </p>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.SITE_URL}" style="background-color: #007BFF; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 16px;">
                            Visit Our Website
                            </a>
                        </div>

                        <p style="font-size: 13px; color: #888888; text-align: center; margin-top: 40px;">
                            &copy; ${(new Date()).getFullYear()} ${process.env.SITE_NAME}. All rights reserved.
                        </p>
                    </div>
                        `
            }, (error) => {
                if (error)
                    console.log(error)
            })

            res.render("newsletter-subscription-confirmation-page", {
                message: "Thanks to Subscribe Our Newsletter Service, Now We can Send Email Regarding Upcoming Events and Many More...",
                show: false,
                title: "Newsletter Subscription",
                currentUrl: "/newsletter",
                session: req.session,
            })
        }
        else {
            res.render("newsletter-subscription-confirmation-page", {
                message: "Please Enter a Valid Email Address",
                show: true,
                title: "Newsletter Subscription",
                currentUrl: "/newsletter",
                session: req.session,
            })
        }
    } catch (error) {
        // console.log(error)
        res.render("newsletter-subscription-confirmation-page", {
            message: "Your Email Address ia Already Regsitered With Us",
            show: false,
            title: "Newsletter Subscription",
            currentUrl: "/newsletter",
            session: req.session,
        })
    }
}

module.exports = {
    homePage: homePage,
    aboutPage: aboutPage,
    featurePage: featurePage,
    departmentPage: departmentPage,
    teamPage: teamPage,
    testimonialPage: testimonialPage,
    contactUsPage: contactUsPage,
    contactUsStorePage: contactUsStorePage,
    enquiryPage: enquiryPage,
    enquiryStorePage: enquiryStorePage,
    galleryPage: galleryPage,
    faqPage: faqPage,
    eventPage: eventPage,
    newsletterSubscription: newsletterSubscription
}