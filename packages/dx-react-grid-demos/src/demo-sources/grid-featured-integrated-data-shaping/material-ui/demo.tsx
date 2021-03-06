import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import {
  Column,
  FilteringState, GroupingState,
  IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSelection, IntegratedSorting,
  PagingState, SelectionState, SortingState, DataTypeProvider, DataTypeProviderProps,
} from '@devexpress/dx-react-grid';
import {
  DragDropProvider,
  Grid, GroupingPanel, PagingPanel,
  Table, TableFilterRow, TableGroupRow,
  TableHeaderRow, TableSelection, Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import {
  generateRows,
  globalSalesValues,
} from '../../../demo-data/generator';

type CurrencyFormatterProps = DataTypeProvider.ValueFormatterProps & WithStyles<typeof styles>;
type CurrencyEditorProps = DataTypeProvider.ValueEditorProps & WithStyles<typeof styles>;

interface ISale {
  product: string,
  region: string,
  amount: string,
  saleDate: string,
  customer: string,
}

interface IGridState {
  columns: Column[],
  rows: ISale[],
  pageSizes: number[],
  currencyColumns: string[],
}

const sales: ISale[] = generateRows({ columnValues: globalSalesValues, length: 1000 });

const availableFilterOperations: string[] = [
  'equal', 'notEqual',
  'greaterThan', 'greaterThanOrEqual',
  'lessThan', 'lessThanOrEqual',
];

const styles = ({ typography }: Theme) => createStyles({
  currency: {
    fontWeight: typography.fontWeightMedium,
  },
  numericInput: {
    width: '100%',
  },
});

const getInputValue = (value?: string) : string =>
  (value === undefined ? '' : value);

const getColor = (amount: number) : string => {
  if (amount < 3000) {
    return '#F44336';
  }
  if (amount < 5000) {
    return '#FFC107';
  }
  if (amount < 8000) {
    return '#FF5722';
  }
  return '#009688';
};

const CurrencyEditor = withStyles(styles)(
  ({ onValueChange, classes, value } : CurrencyEditorProps) => {
    const handleChange = (event) => {
      const { value: targetValue } = event.target;
      if (targetValue.trim() === '') {
        onValueChange(undefined);
        return;
      }
      onValueChange(parseInt(targetValue, 10));
    };
    return (
      <Input
        type="number"
        classes={{
          input: classes.numericInput,
        }}
        fullWidth={true}
        value={getInputValue(value)}
        inputProps={{
          min: 0,
          placeholder: 'Filter...',
        }}
        onChange={handleChange}
      />
    );
  }
);

const CurrencyFormatter = withStyles(styles)(
  ({ value, classes } : CurrencyFormatterProps) =>
    <i className={classes.currency} style={{ color: getColor(value) }}>${value}</i>
);

const CurrencyTypeProvider: React.ComponentType<DataTypeProviderProps> =
  (props: DataTypeProviderProps) => (
    <DataTypeProvider
      formatterComponent={CurrencyFormatter}
      editorComponent={CurrencyEditor}
      availableFilterOperations={availableFilterOperations}
      {...props}
    />
);

export default class Demo extends React.Component<object, IGridState> {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'product', title: 'Product' },
        { name: 'region', title: 'Region' },
        { name: 'amount', title: 'Sale Amount' },
        { name: 'saleDate', title: 'Sale Date' },
        { name: 'customer', title: 'Customer' },
      ],
      currencyColumns: ['amount'],
      pageSizes: [5, 10, 15],
      rows: sales,
    };
  }
  public render(): React.ReactNode {
    const {
      rows, columns, pageSizes,
      currencyColumns,
    } = this.state;

    return (
      <Paper>
        <Grid
          rows={rows}
          columns={columns}
        >
          <FilteringState
            defaultFilters={[{ columnName: 'saleDate', value: '2016-02' }]}
          />
          <SortingState
            defaultSorting={[
              { columnName: 'product', direction: 'asc' },
              { columnName: 'saleDate', direction: 'asc' },
            ]}
          />

          <SelectionState />

          <GroupingState
            defaultGrouping={[{ columnName: 'product' }]}
            defaultExpandedGroups={['EnviroCare Max']}
          />
          <PagingState />

          <IntegratedGrouping />
          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedPaging />
          <IntegratedSelection />

          <CurrencyTypeProvider for={currencyColumns} />

          <DragDropProvider />

          <Table />
          <TableSelection showSelectAll={true} />

          <TableHeaderRow showSortingControls={true} />
          <TableFilterRow showFilterSelector={true} />
          <PagingPanel pageSizes={pageSizes} />

          <TableGroupRow />
          <Toolbar />
          <GroupingPanel showSortingControls={true} />
        </Grid>
      </Paper>
    );
  }
}
