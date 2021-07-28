const { UserModel } = require("../model/user.model")
const { Conflict, BadRequest } = require("http-errors")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")

class AuthService {
  async signup(reqBody) {
    // 1. Validate req.body //* Did it in validate(userSchema)

    const { email, password } = reqBody

    // 2. Find user with email
    const userWithSameEmail = await UserModel.findOne({ email })

    // 3. If user with such email exists - throw 409 (Conflict) error
    if (userWithSameEmail) throw new Conflict("Email in use")

    // 4. If user with such email doesn't exist create new user with hashed password and return him
    const newUser = await UserModel.create({
      email,
      password: await UserModel.hashPassword(password),
      avatarURL: gravatar.url(email, { s: 400 }, true),
    })

    return newUser
  }

  async login(reqBody) {
    // 1. Validate req.body //* Did it in validate(userSchema)

    const { email, password } = reqBody

    // 2. Find user with email
    const user = await UserModel.findOne({ email })

    // 3. If user doesn't exist - throw 401 (Unauthorized) error
    // Вместо ошибки 401 я решил сделать ошибку 400 посольку Николай Левкин рекомендует ошибку 401 использовать только стокеном.
    if (!user) throw new BadRequest("Email or password is wrong")

    // 4. Check password
    const isPasswordCorrect = await UserModel.isPasswordCorrect(password, user.password)

    // 5. If password isn't correct - throw 401 (Unauthorized) error
    // Вместо ошибки 401 я решил сделать ошибку 400 посольку Николай Левкин рекомендует ошибку 401 использовать только стокеном.
    if (!isPasswordCorrect) throw new BadRequest("Email or password is wrong")

    // 5. Create authorization token
    user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    await UserModel.findOneAndUpdate({ email }, { $set: { token: user.token } })

    // 6. Send successful response to client
    return user
  }

  async logout({ email }) {
    await UserModel.findOneAndUpdate({ email }, { $set: { token: null } })
  }

  async updateAvatar(req) {
    const newAvatarURL = `/avatars/${req.file.filename}`

    const user = await UserModel.findByIdAndUpdate(req.user._id, { $set: { avatarURL: newAvatarURL } }, { new: true })

    return user.avatarURL
  }
}

exports.authService = new AuthService()
