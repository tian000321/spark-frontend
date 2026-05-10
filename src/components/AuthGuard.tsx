'use client';
import { useEffect } from 'react';

export default function AuthGuard() {
  useEffect(() => {
    const user = localStorage.getItem('spark_current_user');
    if (!user) {
      window.location.href = '/auth';
    }
  }, []);
  return null;
}