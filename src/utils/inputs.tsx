import { Badge } from 'react-bootstrap';

interface InputsProps {
  inputs: string[];
}

export const Inputs = ({ inputs }: InputsProps) => (
  <>
    {inputs.map(input => (
      <Badge bg="primary">{input}</Badge>
    ))}
  </>
);
