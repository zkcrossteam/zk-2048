import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

export interface KeyControlProps {
  value: number;
  onChange: (value: number) => any;
}

export const KeyControl: FC<KeyControlProps> = ({ onChange }) => (
  <Row>
    <Col xs={12}>
      <p className="text-center text-white">Controls</p>
    </Col>
    {[['up', '12'], ['left'], ['down'], ['right']].map(
      ([controls_name, xs], index) => (
        <Col
          xs={+xs || 4}
          className="d-flex justify-content-center py-2"
          key={controls_name}
        >
          <button
            className={`appearance-none object-fit-cover key-control-${controls_name}`}
            onClick={() => onChange(index)}
          />
        </Col>
      ),
    )}
  </Row>
);
