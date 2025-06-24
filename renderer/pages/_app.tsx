'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import '../styles/globals.css';
import { Fragment } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Fragment>
            <Head>
                <title>Cute Skin</title>
            </Head>
            <div
                className="relative w-svw h-svh"
                onContextMenu={(e) => {
                    e.preventDefault();
                }}
            >
                <Component {...pageProps} />
                <ToastContainer position="bottom-right" closeOnClick={false} theme="light" />
            </div>
        </Fragment>
    );
}

export default MyApp;
