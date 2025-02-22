import Joi from 'joi'

const ForgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'Email không được để trống',
    'string.email': 'Email không hợp lệ'
  })
})

export default ForgotPasswordSchema
