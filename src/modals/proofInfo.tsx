import './style.scss';

import { Container, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { Task } from 'zkwasm-service-helper';

import { useAppSelector } from '../app/hooks';
import { selectL1Account } from '../data/accountSlice';
import { zkwasmHelper } from '../data/endpoint';
import { contract_abi, parseArgs } from '../data/image';
import { Inputs } from '../utils/inputs';
import { bytesToBN } from '../utils/proof';
import { ModalCommon, ModalCommonProps, ModalStatus } from './base';

export interface ProofInfoProps {
  task: Task;
}

export function ProofInfoModal({
  task: { md5, proof, instances, aux, public_inputs, private_inputs },
}: ProofInfoProps) {
  const account = useAppSelector(selectL1Account);
  const aggregateProof = bytesToBN(proof);
  const instancesBN = bytesToBN(instances);
  const auxBN = bytesToBN(aux);

  async function testverify() {
    if (account) {
      const web3 = account.web3!;
      const image = await zkwasmHelper.queryImage(md5);

      if (image.deployment.length > 0) {
        const [{ address }] = image.deployment;
        const verify_contract = new web3.eth.Contract(
          contract_abi.abi,
          address,
          { from: account!.address },
        );
        const args = parseArgs(public_inputs).map(x => x?.toString(10) || '');
        const result = await verify_contract.methods
          .verify(aggregateProof, instancesBN, auxBN, [args])
          .send();

        console.log(`verification result: ${result}`);
      }
    } else {
      console.error('wallet not connected');
    }
  }

  const taskproof = (
    <Container>
      <Tabs defaultActiveKey="Inputs" className="mb-3" justify>
        <Tab eventKey="Inputs" title="Inputs">
          <ul className="list-unstyled">
            <li>
              Public Inputs: <Inputs inputs={public_inputs} />
            </li>
            <li>
              Witness: <Inputs inputs={private_inputs} />
            </li>
          </ul>
        </Tab>
        <Tab eventKey="Instances" title="Instances">
          <ListGroup>
            {instancesBN.map(proof => (
              <ListGroup.Item key={proof.toString('hex')}>
                0x{proof.toString('hex')}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Tab>
        <Tab eventKey="prooftranscript" title="Proof Transcripts">
          <ListGroup className="scroll-300">
            {aggregateProof.map(proof => (
              <ListGroup.Item key={proof.toString('hex')}>
                0x{proof.toString('hex')}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Tab>
        <Tab eventKey="auxdata" title="Aux Data">
          <ListGroup>
            {auxBN.map(proof => (
              <ListGroup.Item key={proof.toString('hex')}>
                0x{proof.toString('hex')}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Tab>
      </Tabs>
    </Container>
  );

  const title = (
    <>
      <span className="gradient-content">Proof</span>
      <span>Information</span>
    </>
  );

  const props: ModalCommonProps = {
    buttonLabel: <button className="appearance-none">Click to show</button>,
    title,
    childrenClass: '',
    onConfirm: testverify,
    valid: true,
    status: ModalStatus.PreConfirm,
    children: taskproof,
    message: '',
    confirmLabel: 'verify on chain',
  };

  return ModalCommon(props);
}
