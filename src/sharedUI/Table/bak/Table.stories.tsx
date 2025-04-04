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

const Template: StoryFn<typeof Table> = (args) => (
  <Table {...args}>
    <Table.Colgroup>
      <col />
      {args.addClass && args.addClass.includes('hidden lg:table-cell') ? null : <col />}
      <col />
    </Table.Colgroup>
    {/* thW={args.thW} */}
    <Table.Thead>
      <tr>
        {args.addClass && args.addClass.includes('double') ? (
          <th>
            Header 1<br />
            (123){' '}
          </th>
        ) : (
          <th>Header 1</th>
        )}
        {args.addClass && args.addClass.includes('hide') ? <th className="hidden lg:table-cell">Header 2</th> : <th>Header 2</th>}
        <th>Header 3</th>
      </tr>
    </Table.Thead>
    {/* tdW={args.tdW} */}
    <Table.Tbody>
      {args.addClass && args.addClass.includes('tableTypeMd') ? null : (
        <>
          <tr>
            <td>Row 1 1</td>
            {args.addClass && args.addClass.includes('hide') ? <td className="hidden lg:table-cell">Row 1 2</td> : <td>Row 1 2</td>}

            {args.addClass && args.addClass.includes('double') ? (
              <td>
                Row 1 3<br />
                (123){' '}
              </td>
            ) : (
              <td>Row 1</td>
            )}
          </tr>
          <tr>
            <td>Row 2 1</td>
            {args.addClass && args.addClass.includes('hide') ? <td className="hidden lg:table-cell">Row 2 2</td> : <td>Row 2 2</td>}
            <td>Row 2 3</td>
          </tr>
        </>
      )}
      <tr>
        <td>Row 3 1</td>
        {args.addClass && args.addClass.includes('hide') ? <td className="hidden lg:table-cell">Row 3 2</td> : <td>Row 3 2</td>}
        <td>Row 3 3</td>
      </tr>
    </Table.Tbody>
  </Table>
);

export const Default_1024 = Template.bind({});
Default_1024.args = {
  addClass: 'table-auto border-collapse border border-gray-300 w-full',
  // thW: 'w-1/5',
  // tdW: 'w-4/5',
};

export const tableType1_1024 = Template.bind({});
tableType1_1024.args = {
  addClass: 'tableType1',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const tableType1_double_1024 = Template.bind({});
tableType1_double_1024.args = {
  addClass: 'tableType1 double',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const tableTypeMd_768 = Template.bind({});
tableTypeMd_768.args = {
  addClass: 'tableTypeMd',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const tableTypeRow_768 = () => (
  <Table addClass="tableTypeRow">
    <Table.Colgroup>
      <col className="w-full md:w-1/6" />
    </Table.Colgroup>
    <Table.Tbody tdW="w-full">
      <tr>
        <th>Header 1</th>
        <td>Row 1 1</td>
        <td>Row 1 2</td>
        <td>Row 1 3</td>
        <td>Row 1 4</td>
        <td>Row 1 5</td>
      </tr>
      <tr>
        <th>Header 2</th>
        <td>Row 2 1</td>
        <td>Row 2 2</td>
        <td>Row 2 3</td>
        <td>Row 2 4</td>
        <td>Row 2 5</td>
      </tr>
    </Table.Tbody>
  </Table>
);

export const Hide_1024 = Template.bind({});
Hide_1024.args = {
  addClass: 'table-auto border-collapse border border-gray-300 w-full hide',
  // thW: 'w-1/3',
  // tdW: 'w-2/3',
};

export const StyledTable = Template.bind({});
StyledTable.args = {
  addClass: 'table-auto border-collapse border border-gray-300 w-full bg-gray-50 text-left',
  // thW: 'w-1/5',
  // tdW: 'w-4/5',
};
