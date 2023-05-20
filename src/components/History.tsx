import { useEffect } from "react";
import { Container, Table } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loadStatus, selectTasks } from "../data/statusSlice";
import { selectL1Account } from "../data/accountSlice";
import { ProofInfoModal } from "../modals/proofInfo";

export interface UserHistoryProps {
  md5: string;
}

export default function ImageDetail(props: UserHistoryProps) {
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account);
  const query = {
    md5: props.md5,
    user_address: account?.address || "",
    id: "",
    tasktype: "Prove",
    taskstatus: "",
  };

  const tasks = useAppSelector(selectTasks);

  useEffect(() => {
    if (account) {
      dispatch(loadStatus(query));
    }
  }, [account]);

  return (
    <Container className="proofs">
      <Table bordered className="rounded">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Submitted by</th>
            <th>Status</th>
            <th>Proof Details</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
            <tr key={task._id["$oid"]}>
              <td>
                <span>{task._id["$oid"]}</span>
              </td>
              <td>
                <span>{task.user_address}</span>
              </td>
              <td>
                <span>{task.status}</span>
              </td>
              <td>
                <ProofInfoModal task={task} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
