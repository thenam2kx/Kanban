import Joi from 'joi'

const SigninSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Mật khẩu không được để trống',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
  })
})

export default SigninSchema
