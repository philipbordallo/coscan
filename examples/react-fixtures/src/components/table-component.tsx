type TableProps = {
  children: React.ReactNode;
};

function TableRoot(props: TableProps) {
  return (
    <table>
      {props.children}
    </table>
  );
}

function Row(props: TableProps) {
  return (
    <tr>
      {props.children}
    </tr>
  );
}

function Cell(props: TableProps) {
  return (
    <td>
      {props.children}
    </td>
  );
}

export const Table = Object.assign(TableRoot, {
  Row,
  Cell,
});
