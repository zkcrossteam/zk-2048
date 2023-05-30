import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import DownDark from '../images/dark/down.svg';
import LeftDark from '../images/dark/left.svg';
import RightDark from '../images/dark/right.svg';
import UpDark from '../images/dark/up.svg';
import DownLight from '../images/light/down.svg';
import LeftLight from '../images/light/left.svg';
import RightLight from '../images/light/right.svg';
import UpLight from '../images/light/up.svg';

export interface ControlProps {
  keyIndex: number;
  step: (index: number) => any;
}

export const Control: FC<ControlProps> = ({ keyIndex, step }) => (
  <Row>
    <Col xs={12}>
      <p className="text-center text-white">Controls</p>
    </Col>
    {[
      [UpDark, UpLight, '12'],
      [LeftDark, LeftLight],
      [DownDark, DownLight],
      [RightDark, RightLight],
    ].map(([Dark, Light, xs], index) => (
      <Col xs={+xs || 4} className="d-flex justify-content-center py-2">
        <button className="appearance-none" onClick={() => step(index)}>
          <img src={keyIndex === index ? Light : Dark} alt="#" />
        </button>
      </Col>
    ))}
  </Row>
);
