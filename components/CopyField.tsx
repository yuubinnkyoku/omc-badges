import { Button, FormControl, InputGroup } from 'react-bootstrap';
import copy from 'copy-text-to-clipboard';

import styles from './CopyField.module.css';

export interface CopyFieldProps {
    title: string,
    value: string,
}
export default function CopyField(props: CopyFieldProps) {
    return (
        <InputGroup className="mb-3">
            <InputGroup.Text className={styles.title}>{props.title}</InputGroup.Text>
            <FormControl readOnly value={props.value} />
            <Button variant="secondary" onClick={() => copy(props.value)}>Copy</Button>
        </InputGroup>
    );
}
