'use client';
import { useTheme } from 'next-themes';
import { Fragment, useEffect } from 'react';

export default function TeamMemberPageClient() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return <Fragment />;
}
