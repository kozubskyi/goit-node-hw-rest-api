const { catchWrapper } = require("./catch-wrapper")
const jwt = require("jsonwebtoken")
const { Unauthorized } = require("http-errors")
const { UserModel } = require("../model/user.model")

exports.authorize = catchWrapper(async (req, res, next) => {
  try {
    // 1. Get token from request
    const authHeader = req.headers.authorization || ""
    const token = authHeader.replace("Bearer ", "")

    // 2. Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Get user by id from payload
    const user = await UserModel.findById(payload.id)

    // 5. If no user - throw 401 (Unauthorized) error
    if (!user) throw new Unauthorized("Not authorized")

    // 6. Set req.user
    req.user = user
    req.user.token = token

    // 7. Call next()
    next()
  } catch (err) {
    // 3. If token verification failed - throw 401 (Unauthorized) error
    next(new Unauthorized("Not authorized"))
  }
})
