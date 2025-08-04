import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Container, Navbar } from 'react-bootstrap';

import UsernameInput from '../components/UsernameInput';
import Generator from '../components/Generator';

const OmcURL = (name: string) => `https://onlinemathcontest.com/users/${name}`;
const shieldsioLink = (url: string) => `https://img.shields.io/endpoint?url=${encodeURIComponent(url)}`;

export default function() {
    const [username, setUsername] = useState('simasima');
    const [apiOrigin, setApiOrigin] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (window) {
            setApiOrigin(window.location.origin);
        }
    }, []);

    const dataLink = (type: string, name: string) => {
        const url = new URL(apiOrigin + `/api/${type}/json/${name}`);
        if (url.protocol === 'http:') {
            url.protocol = 'https:';
        }
        return url.toString();
    };
    const onSubmit = useCallback((name: string) => {
        setIsLoading(true);
        setUsername(name);
    }, [setUsername]);

    const onBadgeLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <>
            <Head>
                <title>OMC Badges</title>
                <meta name="description" content="OMCのレートを表示するバッジを生成します。" />
            </Head>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>OMC Badges</Navbar.Brand>
            </Navbar>
            <Container>
                <h1 className="mt-4">OMC Badges</h1>
                <p>
                    このサイトはOMCのレートを表示するバッジを生成します。
                </p>
                <p>
                    このサイトは <a href="https://atcoder-badges.vercel.app/" target="_blank" rel="noopener noreferrer">AtCoder Badges</a> (<a href="https://github.com/makutamoto/atcoder-badges" target="_blank" rel="noopener noreferrer">makutamoto/atcoder-badges</a>) をフォークして作成しました。
                    <br />
                    このサイトのGitHubリポジトリ: <a href="https://github.com/yuubinnkyoku/omc-badges" target="_blank" rel="noopener noreferrer">https://github.com/yuubinnkyoku/omc-badges</a>
                    <br />
                    作者: <a href="https://github.com/yuubinnkyoku" target="_blank" rel="noopener noreferrer">yuubinnkyoku</a>
                </p>
                <UsernameInput onSubmit={onSubmit} />
                <hr />
                {apiOrigin && (
                    <>
                        <Generator
                            title="OMC"
                            tip={username}
                            link={OmcURL(username)}
                            badge={shieldsioLink(dataLink('omc', username))}
                            isLoading={isLoading}
                            onBadgeLoad={onBadgeLoad}
                        />
                    </>
                )}
            </Container>
        </>
    );
};
