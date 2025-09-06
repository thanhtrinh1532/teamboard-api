/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'


const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  // Nếu như clientAccessToken không tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    // Bước 1: Thực hiện giải mã token xem nó hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    console.log(accessTokenDecoded)

    // Bước 2: Quan trọng: nếu như token hợp lêk thì cần phải lưu lại thông tin giải mã được vào jwtDecoded để xử dụng về sau
    req.jwtDecoded = accessTokenDecoded

    // Bước 3: Cho phép cái request đi tiếp
    next()

  } catch (error) {
    console.log('authMiddleware: ', error)
    // Nếu cái accessToken bị hết hạn thì mình cần trả về một cái mã lỗi cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }

    // Nếu như cái accessToken không hợp lệ do bất cứ điều gì thì chung ta trả về mã lỗi 401 cho phía FE gọi api sign_out
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = { isAuthorized }