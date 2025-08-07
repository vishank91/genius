const multer = require('multer')

function createUploader(folderName) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/${folderName}`)
        },
        filename: function (req, file, cb) {
             cb(null, Date.now() + file.originalname)
        }
    })
    return multer({ storage: storage })
}
module.exports = {
    departmentUploader: createUploader("department"),
    eventUploader: createUploader("event"),
    featureUploader: createUploader("feature"),
    galleryUploader: createUploader("gallery"),
    teamUploader: createUploader("team"),
    testimonialUploader: createUploader("testimonial"),
}