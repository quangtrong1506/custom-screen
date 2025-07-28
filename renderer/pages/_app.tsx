'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import '../styles/globals.css';
import { Fragment } from 'react';
import { Emit, Progess } from '../components/_common';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Fragment>
			<Head>
				<title>Live Wallpaper for Windows</title>
			</Head>
			<div
				className="relative h-svh w-svw"
				onContextMenu={e => {
					e.preventDefault();
				}}
			>
				<Component {...pageProps} />
				<ToastContainer position="bottom-right" closeOnClick={false} theme="light" />
			</div>
			<Emit />
			<Progess />
		</Fragment>
	);
}

export default MyApp;
