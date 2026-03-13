import { Table } from './table-component';

export function SubComponent() {
  return (
    <Table variant="compact">
      <Table.Row>
        <Table.Cell>Cell 1</Table.Cell>
        <Table.Cell>Cell 2</Table.Cell>
      </Table.Row>
    </Table>
  );
}
