'use client';

import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { BgMain } from '../components';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <title>Cute Skin</title>
            </Head>
            <div onContextMenu={(e) => e.preventDefault()}>
                <Component {...pageProps} />
                <BgMain />
            </div>
        </React.Fragment>
    );
}

export default MyApp;
