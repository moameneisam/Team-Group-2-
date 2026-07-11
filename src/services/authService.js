import api from './api';

export async function login(email, password) {
  const { data } = await api.get('/users', {
    params: { email, password },
  });

  const user = data[0];
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function register({ name, email, password }) {
  const { data: existing } = await api.get('/users', {
    params: { email },
  });

  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const { data } = await api.post('/users', {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    avatar: '',
    createdAt: new Date().toISOString(),
  });

  const { password: _, ...safeUser } = data;
  return safeUser;
}

export async function requestPasswordReset(email) {
  const { data } = await api.get('/users', {
    params: { email: email.trim().toLowerCase() },
  });

  if (data.length === 0) {
    throw new Error('No account found with this email address.');
  }

  const token = `reset-${Date.now()}`;
  await api.post('/passwordResets', {
    email: email.trim().toLowerCase(),
    token,
    createdAt: new Date().toISOString(),
    used: false,
  });

  return { token, message: 'Password reset link generated. Use the token below to reset your password.' };
}

export async function resetPassword(email, token, newPassword) {
  const { data: resets } = await api.get('/passwordResets', {
    params: { email: email.trim().toLowerCase(), token, used: false },
  });

  if (resets.length === 0) {
    throw new Error('Invalid or expired reset token.');
  }

  const { data: users } = await api.get('/users', {
    params: { email: email.trim().toLowerCase() },
  });

  if (users.length === 0) {
    throw new Error('User not found.');
  }

  await api.patch(`/users/${users[0].id}`, { password: newPassword });
  await api.patch(`/passwordResets/${resets[0].id}`, { used: true });

  return { message: 'Password updated successfully. You can now sign in.' };
}

export async function updateProfile(userId, updates) {
  const { data } = await api.patch(`/users/${userId}`, updates);
  const { password: _, ...safeUser } = data;
  return safeUser;
}
