// Custom authentication client that works with our custom backend
export async function signInWithEmail(email: string, password: string) {
  try {
    const response = await fetch('/api/auth/sign-in/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Sign-in failed' };
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function signOut() {
  try {
    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Force reload to clear any cached session data
      window.location.href = '/';
      return { success: true };
    } else {
      return { error: 'Sign-out failed' };
    }
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export async function getSession() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  try {
    const response = await fetch('/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Sign-up failed' };
    }

    return { user: data.user, session: data.session };
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}