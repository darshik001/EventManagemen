const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = new Set([
    '.jpeg', '.jpg', '.png', '.gif', '.webp',
    '.mp3', '.wav', '.ogg', '.m4a', '.aac',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'
  ]);
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimeType = /^(image\/|audio\/|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.|vnd\.ms-|vnd\.oasis\.opendocument\.)|text\/plain)/i;

  if (allowedExtensions.has(extension) && allowedMimeType.test(file.mimetype || '')) {
    return cb(null, true);
  } else {
    cb(new Error('Only image, audio, and PDF/Office/text document files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;
