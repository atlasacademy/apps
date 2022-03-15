import { Form } from "react-bootstrap";

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

export default function NumberSelector(props: {
    value: string | number | string[] | undefined;
    onChange: (ev: ChangeEvent) => void;
    min?: number;
    max?: number;
    placeholder?: string;
}) {
    const placeholder = props.placeholder ? props.placeholder : "Enter a positive integer";
    return (
        <Form.Control
            placeholder={placeholder}
            value={props.value}
            type="number"
            min={props.min}
            max={props.max}
            onChange={props.onChange}
        />
    );
}
