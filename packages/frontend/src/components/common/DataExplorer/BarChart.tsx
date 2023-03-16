import invariant from 'invariant';
import * as React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import * as R from 'remeda';
import Select from '../../ui/Select';
import LabelWrapper from '../../ui/LabelWrapper';
import Slider from '../../ui/Slider';
import assertUnreachable from '../../../utils/assertUnreachable';

import type { Dataframe } from './types';

type Props = {
  dataframe: Dataframe;
};

type BarDatum = Record<string, string | number>;
type BarData = BarDatum[];

const BOTTOM_AXIS_TICK_MAX_LENGTH = 12;
const MAX_BARS = 100;

function renderBottomAxisTick(v: string): JSX.Element | string {
  if (v.length > BOTTOM_AXIS_TICK_MAX_LENGTH) {
    return (
      <tspan>
        {v.substring(0, BOTTOM_AXIS_TICK_MAX_LENGTH)}...
        <title>{v}</title>
      </tspan>
    );
  }
  return v;
}

type SortOrder = 'asc' | 'desc';
type SortBy = 'count' | 'xAxis';

const SORT_ORDER_OPTIONS = [
  {
    value: 'asc',
    displayValue: 'Ascending',
  },
  {
    value: 'desc',
    displayValue: 'Descending',
  },
] as const;

export function BarChart({ dataframe }: Props): JSX.Element {
  const { data, fields } = dataframe;

  // get all categorical fields (these are the only ones we allow in the x-axis)
  const categoricalFields = React.useMemo(
    () => fields.filter(field => field.type === 'text'),
    [fields],
  );

  const [xField, selectedXField] = React.useState(categoricalFields[0].id);
  const xFieldName = React.useMemo(
    () =>
      categoricalFields.find(field => field.id === xField)?.displayName ??
      xField,
    [categoricalFields, xField],
  );

  const [sortOrder, selectedSortOrder] = React.useState<SortOrder>('asc');
  const [sortBy, selectedSortBy] = React.useState<SortBy>('count');

  // prepare any Select options
  const fieldOptions = React.useMemo(
    () =>
      categoricalFields.map(field => ({
        value: field.id,
        displayValue: field.displayName,
      })),
    [categoricalFields],
  );

  const sortByOptions = React.useMemo(
    () =>
      [
        {
          value: 'count',
          displayValue: 'Count',
        },
        {
          value: 'xAxis',
          displayValue: xFieldName,
        },
      ] as const,
    [xFieldName],
  );

  // rebuild the bar data
  const fullBarData: BarData = React.useMemo(() => {
    const barObjects = R.pipe(
      data,
      R.groupBy(row => {
        if (xField in row && row[xField]) {
          const xValStr = String(row[xField]);
          if (xValStr === '') {
            return '[empty string]';
          }
          return xValStr;
        }
        return 'null';
      }),
      R.mapValues(rows => rows.length),
      R.toPairs,
      R.map(([key, val]) => ({
        [xField]: key,
        count: val,
      })),
    );
    return barObjects;
  }, [data, xField]);

  const maxAllowableNumBins = Math.min(fullBarData.length, MAX_BARS);

  // if we actually should have more bars than the MAX_BARS, then
  // we will want to show a tooltip explaining that the reason we aren't
  // displaying all bars is due to performance reasons
  const isNumBinsTruncated = fullBarData.length > MAX_BARS;

  const [numBins, setNumBins] = React.useState(maxAllowableNumBins);

  // if we switch fields, the currently selected numBins might be greater
  // than the new max, so we want to make sure we don't exceed the max
  const numBinsToUse = Math.min(numBins, maxAllowableNumBins);

  const processedBarData = React.useMemo(
    () =>
      R.pipe(
        fullBarData,
        R.sort((bar1, bar2) => {
          const sortOrderSign = sortOrder === 'asc' ? 1 : -1;
          switch (sortBy) {
            case 'count':
              invariant(
                'count' in bar1 && 'count' in bar2,
                'Counts must exist in both bars',
              );
              return sortOrderSign * (Number(bar2.count) - Number(bar1.count));
            case 'xAxis':
              invariant(
                xField in bar1 && xField in bar2,
                `${xField} must exist in both bars`,
              );
              return (
                sortOrderSign *
                String(bar1[xField]).localeCompare(String(bar2[xField]))
              );
            default:
              return assertUnreachable(sortBy);
          }
        }),
        R.take(numBinsToUse),
      ),
    [numBinsToUse, xField, sortOrder, sortBy, fullBarData],
  );

  return (
    <div>
      <div className="flex space-x-4">
        <LabelWrapper label="X axis">
          <Select
            options={fieldOptions}
            value={xField}
            onChange={selectedXField}
          />
        </LabelWrapper>
        <LabelWrapper label="Sort by">
          <Select
            options={sortByOptions}
            value={sortBy}
            onChange={selectedSortBy}
          />
        </LabelWrapper>
        <LabelWrapper label="Sort order">
          <Select
            options={SORT_ORDER_OPTIONS}
            value={sortOrder}
            onChange={selectedSortOrder}
          />
        </LabelWrapper>
        <LabelWrapper
          label="Number of bins"
          labelTextClassName="pb-2"
          infoTooltip={
            isNumBinsTruncated
              ? `There are ${fullBarData.length} possible ${xFieldName} values but we can only show the first ${MAX_BARS} for performance reasons`
              : undefined
          }
        >
          <Slider
            width={200}
            value={[numBinsToUse]}
            onValueChange={([val]) => setNumBins(val)}
            min={1}
            max={maxAllowableNumBins}
          />
        </LabelWrapper>
      </div>
      <div className="w-full" style={{ height: '55vh' }}>
        <ResponsiveBar
          keys={['count']}
          data={processedBarData}
          indexBy={xField}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: '#38bcb2',
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#eed312',
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: renderBottomAxisTick,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30,
            legend: xFieldName,
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          role="application"
          ariaLabel="Bar chart"
          barAriaLabel={e =>
            `${e.id} ${e.formattedValue} in ${xField}: ${e.indexValue}`
          }
        />
      </div>
    </div>
  );
}
