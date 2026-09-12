import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export async function signup(req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are all required.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password should be at least 6 characters.' })
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  const token = signToken(user)

  res.status(201).json({ user, token })
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = signToken(user)
  res.json({ user, token })
}

export async function me(req, res) {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json({ user })
}

export async function becomeHost(req, res) {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      })
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        message: 'Admins already have full access.',
      })
    }

    if (user.role === 'host') {
      return res.status(400).json({
        message: 'You are already a host.',
      })
    }

    user.role = 'host'
    await user.save()

    res.json({
      message: 'You are now a host — you can add your first property.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Become host error:', error)

    res.status(500).json({
      message: 'Failed to submit host application.',
    })
  }
}