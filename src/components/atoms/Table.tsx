import RcTable from "rc-table";
import styled from "styled-components";

const StyledRcTable = styled(RcTable)`
  th {
    text-align: left;
    text-decoration: underline;
  }
`;
const Table = (props: any) => {
  return <StyledRcTable {...props} />;
};

export default Table;
