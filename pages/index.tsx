import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Container, Navbar } from 'react-bootstrap';

import UsernameInput from '../components/UsernameInput';
import Generator from '../components/Generator';

const AtCoderURL = (name: string) => `https://atcoder.jp/users/${name}`;
const CodeforcesURL = (name: string) => `https://codeforces.com/profile/${name}`;
const OmcURL = (name: string) => `https://onlinemathcontest.com/user/${name}`;
const shieldsioLink = (url: string) => `https://img.shields.io/endpoint?url=${encodeURIComponent(url)}`;

export default function() {
    const [username, setUsername] = useState('tourist');
    const [apiOrigin, setApiOrigin] = useState('');

    useEffect(() => {
        if (window) {
            setApiOrigin(window.location.origin);
        }
    }, []);

    const dataLink = (type: string, name: string) => apiOrigin + `/api/${type}/json/${name}`;
    const onSubmit = useCallback((name: string) => setUsername(name), [setUsername]);

    return (
        <>
            <Head>
                <title>AtCoder/Codeforces/OMC Badges</title>
                <meta name="description" content="AtCoder、Codeforces、OMCのレートを表示するバッジを生成します。" />
            </Head>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>AtCoder/Codeforces/OMC Badges</Navbar.Brand>
            </Navbar>
            <Container>
                <h1 className="mt-4">AtCoder/Codeforces/OMC Badges</h1>
                <p>
                    このサイトはAtCoder、Codeforces、OMCのレートを表示するバッジを生成します。
                </p>
                <p>
                    このサイトのGitHubリポジトリ: <a href="https://github.com/yuubinnkyoku/omc-badges" target="_blank" rel="noopener noreferrer">https://github.com/yuubinnkyoku/omc-badges</a>
                    <br />
                    作者: <a href="https://github.com/yuubinnkyoku" target="_blank" rel="noopener noreferrer">yuubinnkyoku</a>
                </p>
                <UsernameInput onSubmit={onSubmit} />
                <hr />
                {apiOrigin && (
                    <>
                        <Generator title="AtCoder" tip={username} link={AtCoderURL(username)} badge={shieldsioLink(dataLink('atcoder', username))} />
                        <Generator title="Codeforces" tip={username} link={CodeforcesURL(username)} badge={shieldsioLink(dataLink('codeforces', username))} />
                        <Generator title="OMC" tip={username} link={OmcURL(username)} badge={shieldsioLink(dataLink('omc', username))} />
                    </>
                )}
            </Container>
        </>
    );
};
