// auth.js - Sign Up, Login, Google, 【entity-GitHub¦canonical_name=GitHub】, OpenCode
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'rahsia-terminal-cloud';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); } catch { return []; }
}
function saveUsers(users) { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); }

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, provider: user.provider }, JWT_SECRET, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Sila login dulu' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { return res.status(401).json({ error: 'Token tamat' }); }
}

// Simpan atau update user dari OAuth
function findOrCreateOAuthUser(profile, provider) {
  const users = loadUsers();
  let user = users.find(u => u.email === profile.email);
  if (!user) {
    user = {
      id: Date.now().toString(),
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatar: profile.avatar || '',
      provider,
      password: '',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  }
  return user;
}

async function exchangeCode(tokenUrl, params) {
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: new URLSearchParams(params)
  });
  return res.json();
}

module.exports = { loadUsers, saveUsers, makeToken, requireAuth, findOrCreateOAuthUser, exchangeCode, JWT_SECRET };