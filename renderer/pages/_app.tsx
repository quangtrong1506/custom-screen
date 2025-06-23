'use client';

import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { BgMain, RightMenu } from '../components';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const [rightMenu, setRightMenu] = useState({
        open: false,
        position: { x: 0, y: 0 },
    });

    useEffect(() => {
        const mouseLeave = () => {
            setRightMenu({ open: false, position: { x: 0, y: 0 } });
        };
        document.body.addEventListener('mouseleave', mouseLeave);

        return () => {
            document.body.removeEventListener('mouseleave', mouseLeave);
        };
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Cute Skin</title>
            </Head>
            <div
                className="relative w-svw h-svh"
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (e.button === 2 && (e.target as HTMLElement).className.includes('mouse-click-selector')) {
                        setRightMenu({ open: true, position: { x: e.clientX, y: e.clientY } });
                    }
                }}
                onClick={(e) => {
                    if (e.button === 0) {
                        setRightMenu({ open: false, position: { x: 0, y: 0 } });
                    }
                }}
            >
                <Component {...pageProps} />
                <BgMain />
                <RightMenu
                    open={rightMenu.open}
                    onClose={() => setRightMenu({ open: false, position: { x: 0, y: 0 } })}
                    position={[rightMenu.position.x, rightMenu.position.y]}
                />
            </div>
        </React.Fragment>
    );
}

export default MyApp;
