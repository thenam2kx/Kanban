import Joi from 'joi'

const VerifyPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ'
  }),
  code: Joi.string().required().min(6).max(6).messages({
    'string.empty': 'Mã xác nhận không được để trống',
    'string.email': 'Mã xác nhận không hợp lệ',
    'string.min': 'Mã xác nhận phải có 6 ký tự',
    'string.max': 'Mã xác nhận phải có 6 ký tự'
  })
})

export default VerifyPasswordSchema
