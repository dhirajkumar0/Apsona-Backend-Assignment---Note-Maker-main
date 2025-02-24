const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.register = async (req, res) => {
  try {
    const {email, password} = req.body

    // Check if user already exists
    let user = await User.findOne({email})
    if (user) {
      return res.status(400).json({message: 'User already exists'})
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10)
    user = new User({email, password: hashedPassword})
    await user.save()

    // Generate JWT
    const token = jwt.sign({userId: user._id}, 'your_jwt_secret', {
      expiresIn: '1h',
    })
    res.status(201).json({token})
  } catch (error) {
    res.status(500).json({message: 'Error creating user', error})
  }
}

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body

    // Check if user exists
    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({message: 'Invalid credentials'})
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({message: 'Invalid credentials'})
    }

    // Generate JWT
    const token = jwt.sign({userId: user._id}, 'your_jwt_secret', {
      expiresIn: '1h',
    })
    res.json({token})
  } catch (error) {
    res.status(500).json({message: 'Error logging in', error})
  }
}
