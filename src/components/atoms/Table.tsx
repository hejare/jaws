import RcTable from "rc-table";
import styled from "styled-components";

const StyledRcTable = styled(RcTable)`
  text-align: -webkit-center;
  .row-0 {
    background-color: #123321;
  }
  th {
    text-transform: uppercase;
    padding: 4px;
    text-align: left;
  }
  td {
    padding: 4px;
  }
  td.operations > div > div {
    margin-right: 16px;
    margin-bottom: auto;
  }
  td.image img {
    width: 100px;
    max-inline-size: -webkit-fill-available;
  }
`;
const Table = (props: any) => {
  return (
    <StyledRcTable
      rowClassName={(record: any, i: number) => `row-${i % 2}`}
      {...props}
    />
  );
};

export const Operations = styled.div`
  display: flex;
`;

export default Table;
