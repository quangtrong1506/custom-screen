'use client';

import React from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <title>Cute Skin</title>
            </Head>
            <div onContextMenu={(e) => e.preventDefault()}>
                <Component {...pageProps} />
            </div>
        </React.Fragment>
    );
}

export default MyApp;
