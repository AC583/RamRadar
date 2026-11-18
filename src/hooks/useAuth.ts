import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/user';
import {
  signInWithGoogle as authSignInWithGoogle,
  signOutUser as authSignOutUser,
  onAuthStateChangedWrapper,
  setActiveDevPersona,
  getActiveDevPersona,
  DEV_PERSONAS,
} from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => getActiveDevPersona());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedWrapper((profile, isLoading) => {
      setUser(profile);
      setLoading(isLoading);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async () => {
    setLoading(true);
    try {
      const profile = await authSignInWithGoogle();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await authSignOutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectDevPersona = useCallback((persona: UserProfile | null) => {
    setActiveDevPersona(persona);
    setUser(persona);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    signIn,
    signOut,
    selectDevPersona,
    devPersonas: DEV_PERSONAS,
    isDevUser: user ? user.uid.startsWith('dev-') : false,
  };
}
