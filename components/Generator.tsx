import CopyField from './CopyField';

export interface GeneratorProps {
    title: string,
    tip: string,
    link: string,
    badge: string,
    isLoading: boolean,
    onBadgeLoad: () => void,
}
export default function Generator(props: GeneratorProps) {
    return (
        <>
            <div className="my-4">
                <h2>{props.title}</h2>
                <CopyField title="HTML" value={`<a href="${props.link}" target="_blank" title="${props.tip}"><img src="${props.badge}" /></a>`} />
                <CopyField title="Markdown" value={`[![${props.tip}](${props.badge})](${props.link})`} />
                <h3>Preview</h3>
                {props.isLoading && <p>読み込み中...</p>}
                <a href={props.link} target="_blank" title={props.tip} rel="noreferrer" style={{ display: props.isLoading ? 'none' : 'block' }}>
                    <img src={props.badge} alt={`${props.title} badge`} onLoad={props.onBadgeLoad} onError={props.onBadgeLoad} />
                </a>
            </div>
        </>
    );
}
