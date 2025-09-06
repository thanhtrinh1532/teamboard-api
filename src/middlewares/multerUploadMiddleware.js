/* eslint-disable no-console */
import multer from 'multer'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from '~/utils/validators'
/** Hầu hết những thứ bên dưới đều có docs của multer, chỉ là tổ chức lại cho gọn nhất */
// https://www.npmjs.com/package/multer

// Function kiểm tra loại file nào được chấp nhận
const customFileFilter = (req, file, callback) => {
  console.log('Multer File: ', file)

  // Đối với Multer kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(errMessage, null)
  }
  // Nếu kiểu file hợp lệ
  return callback(null, true)
}

// Khởi tạo function upload được tạo bởi multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
