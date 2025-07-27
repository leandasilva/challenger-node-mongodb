const express = require('express');
const { upload, list } = require('./controller');
const router = express.Router();
//const uploadFile = multer({ dest: './_temp' });


router.post('/upload', upload);
router.get('/records', list);

module.exports = router;
