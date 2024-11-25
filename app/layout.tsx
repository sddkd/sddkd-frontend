import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  title: 'SDDKD',
  description: 'SSDKD',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning style={{height:"100%", width:"100%"}}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{width: "100%", height: "100%"}}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
