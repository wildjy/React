import { Meta, StoryFn } from '@storybook/react';
import Table from '../Table';

export default {
  title: 'UI/Table/Table',
  component: Table,
  argTypes: {
    addClass: {
      control: 'text',
      description: 'Additional classes for table styling',
      defaultValue: '',
    },
    thW: {
      control: 'text',
      description: 'Width classes for the table header',
      defaultValue: 'w-1/5',
    },
    tdW: {
      control: 'text',
      description: 'Width classes for the table header',
      defaultValue: 'w-4/5',
    },
  },
  tags: ['autodocs'],
} as Meta<typeof Table>;


const Template: StoryFn<typeof Table> = (args) => {
  const classList = args.addClass?.split(' ') ?? [];

  const shouldTableTypeMd = classList.includes('tableTypeMd');
  const shouldTableType = classList.includes('tableType');
  const shouldDouble = classList.includes('double');
  const shouldHideCol = classList.includes('hide');
  const shouldHideMobile = classList.includes('hideM');

  const typeClass = shouldHideCol
  ? 'hide'
  : shouldHideMobile
  ? 'hideM'
  : shouldDouble ? 'double'
  : shouldTableTypeMd ? 'tableTypeMd'
  : shouldTableType ? 'tableType1'
  : undefined;

  return (
    <Table {...args}>
      <Table.Colgroup>
        <col />
        <col />
        <col />
      </Table.Colgroup>
      {/* thW={args.thW} */}
      <Table.Thead>
        <tr>
          <th>Header 1</th>
          {shouldDouble ? (
            <th className={typeClass}>
              Header 2<br />
              (123){' '}
            </th>
          ) : (
            <th className={typeClass}>Header 2</th>
          )}
          <th>Header 3</th>
        </tr>
      </Table.Thead>
      {/* tdW={args.tdW} */}
      <Table.Tbody tdW={args.tdW}>
        {typeClass ? null : (
          <>
            <tr>
              <td>Row 1 1</td>
              <td>Row 1 2</td>
              <td>Row 1 3</td>
            </tr>
            <tr>
              <td>Row 2 1</td>
              <td>Row 2 2</td>
              <td>Row 2 3</td>
            </tr>
          </>
        )}
        <tr>
          <td>Row 3 1</td>
          {shouldDouble ? (
            <td className={typeClass}>
              Row 3 2<br />
              (123){' '}
            </td>
          ) : (
            <td className={typeClass}>Row 3 2</td>
          )}
          <td>Row 3 3</td>
        </tr>
      </Table.Tbody>
    </Table>
  )
};

export const Default_1024 = Template.bind({});
Default_1024.args = {
  addClass: '',
  // thW: 'w-1/5',
  // tdW: 'w-4/5',
};

export const TableType_1024 = Template.bind({});
TableType_1024.args = {
  addClass: 'TableType',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const TableType_double_1024 = Template.bind({});
TableType_double_1024.args = {
  addClass: 'TableType double',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const TableTypeMd_768 = Template.bind({});
TableTypeMd_768.args = {
  addClass: 'tableTypeMd',
  // thW: 'w-1/5',
  // tdW: 'w-4/5',
};

export const Hide_1024 = Template.bind({});
Hide_1024.args = {
  addClass: 'hide',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const HideM_768 = Template.bind({});
HideM_768.args = {
  addClass: 'hideM',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const TableTypeChangeWidth = Template.bind({});
TableTypeChangeWidth.args = {
  addClass: 'TableType',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const TableTypeMdChangeWidth = Template.bind({});
TableTypeMdChangeWidth.args = {
  addClass: 'tableTypeMd',
  thW: 'w-1/5',
  tdW: 'w-4/5',
};

export const StyledTable = Template.bind({});
StyledTable.args = {
  addClass: '',
  // thW: 'w-1/5',
  // tdW: 'w-4/5',
};
