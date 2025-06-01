'use client';
import { useTheme } from 'next-themes';
import { Fragment, useEffect } from 'react';

export default function ServicePageClient() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  return <Fragment />;
}
