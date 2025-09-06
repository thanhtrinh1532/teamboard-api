import cloudinary from 'cloudinary'
import { result } from 'lodash'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

// sử dụng https://cloudinary.com/documentation/node_asset_administrationhttps://cloudinary.com/documentation/node_asset_administration
// Tài khoản cloudinary https://console.cloudinary.com/app/c-75b6e6dd5b2f849062e62afd3d1a0d/settings/api-keys

// Bước cấu hình cloudinary, sử dụng v2 - version 2
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

// Khởi tạo một function để upload lên Cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
     // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}

export const CloudinaryProvider = { streamUpload }
