import multer from 'multer';

// Set up storage options for multer (e.g., destination, filename)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'uploads/');
    
      if (file.fieldname === 'prescription') {
        cb(null, 'uploads/prescriptions/'); // ✅ Store prescriptions here
     // ✅ Store general images here
      }else if (file.fieldname === 'result') {
        cb(null, 'uploads/results/'); // 
      }else if (file.fieldname === 'order') {
        cb(null, 'uploads/order/'); // 
      }
       else {
        cb(null, 'uploads/'); // Default location
      }
  }, 
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Create the upload instance
export const upload = multer({ storage: storage });
// Middleware for multiple images upload
export const uploadMultipleImages = upload.array('images', 10); // Adjust the max count as needed


