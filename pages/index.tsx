import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head'
import { Container, Navbar, Form } from 'react-bootstrap';

import UsernameInput from '../components/UsernameInput';
import Generator from '../components/Generator';

const OmcURL = (name: string) => `https://onlinemathcontest.com/users/${name}`;
const shieldsioLink = (url: string, style: string) => {
    let result = `https://img.shields.io/endpoint?url=${encodeURIComponent(url)}`;
    if (style) {
        result += `&style=${style}`;
    }
    return result;
};

export default function() {
    const [username, setUsername] = useState('simasima');
    const [style, setStyle] = useState('');
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
            url.protocol = 'https';
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
                    このサイトのGitHubリポジトリ: <a href="https://github.com/yuubinnkyoku/omc-badges" target="_blank" rel="noopener noreferrer">https://github.com/yuubinnkyoku/omc-badges</a>
                    <br />
                    作者: <a href="https://github.com/yuubinnkyoku" target="_blank" rel="noopener noreferrer">yuubinnkyoku</a>
                    <br />
                    このサイトは <a href="https://atcoder-badges.vercel.app/" target="_blank" rel="noopener noreferrer">AtCoder Badges</a> (<a href="https://github.com/makutamoto/atcoder-badges" target="_blank" rel="noopener noreferrer">makutamoto/atcoder-badges</a>) をフォークして作成しました。
                </p>
                <UsernameInput onSubmit={onSubmit} />
                <Form.Group>
                    <Form.Label>Style</Form.Label>
                    <Form.Control as="select" value={style} onChange={e => setStyle(e.target.value)}>
                        <option value="flat">flat</option>
                        <option value="flat-square">flat-square</option>
                        <option value="plastic">plastic</option>
                        <option value="for-the-badge">for-the-badge</option>
                        <option value="social">social</option>
                    </Form.Control>
                </Form.Group>
                <hr />
                {apiOrigin && (
                    <>
                        <Generator
                            title="OMC"
                            tip={username}
                            link={OmcURL(username)}
                            badge={shieldsioLink(dataLink('omc', username), style)}
                            isLoading={isLoading}
                            onBadgeLoad={onBadgeLoad}
                        />
                    </>
                )}
            </Container>
        </>
    );
};
