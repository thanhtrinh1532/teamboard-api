
// const SibApiV3Sdk = require('@getbrevo/brevo')
import * as SibApiV3Sdk from '@getbrevo/brevo';
import { env } from '~/config/environment'

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Khởi tạo một cái sendSmtpEmail với những thông tin cần thiết
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Tài khoản gửi mail: lưu ý địa chỉ admin email phải là tài khoản API Brevo
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // Những tài khoản nhận email
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = htmlContent

  // Gọi hành động gửi mail
//   return apiInstance.sendTransacEmail(sendSmtpEmail)
try {
    console.log('BrevoProvider - Sending email with payload:', JSON.stringify(sendSmtpEmail, null, 2))
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('BrevoProvider - Email sent successfully:', response)
    return response
  } catch (error) {
    console.error('BrevoProvider - Error sending email:', error.response?.text || error.message)
    throw new Error(`Gửi email thất bại: ${error.response?.text || error.message}`)
  }
}

export const BrevoProvider = {
  sendEmail
}
