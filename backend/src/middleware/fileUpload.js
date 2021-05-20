const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 1000000, // 1Mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Uploaded file must be of type jpg, jpeg, or png."));
    }
    cb(undefined, true);
  },
});

module.exports = upload;
