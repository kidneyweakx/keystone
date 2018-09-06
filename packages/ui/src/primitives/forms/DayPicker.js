// @flow
import React, { type Node, type Ref } from 'react';
import styled from 'react-emotion';
import Kalendaryo from 'kalendaryo';
import { isToday as isDayToday, isSameMonth, parse, getYear, getMonth } from 'date-fns';
import { Input } from './index';
import { Select } from '../filters';

import { ChevronLeftIcon, ChevronRightIcon } from '@keystonejs/icons';
import { borderRadius, colors } from '../../theme';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Wrapper = styled.div({
  fontSize: '0.85rem',
});
const Header = styled.div({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
});

const HeaderButton = props => (
  <button
    type="button"
    css={{
      background: 'none',
      borderRadius: borderRadius,
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem 0.75rem',
      outline: 'none',

      ':hover': {
        backgroundColor: colors.N05,
      },
      ':active': {
        backgroundColor: colors.N10,
      },
    }}
    {...props}
  />
);
const Body = 'div';

const WeekRow = styled.div({
  display: 'flex',
});

const WeekLabels = styled(WeekRow)({
  color: colors.N40,
  fontSize: '0.65rem',
  fontWeight: 500,
  textTransform: 'uppercase',
});

const Day = styled.div(({ disabled, isInteractive, isSelected, isToday }) => {
  let textColor;
  if (isToday) textColor = colors.danger;
  if (disabled) textColor = colors.N40;
  if (isSelected) textColor = 'white';

  return {
    alignItems: 'center',
    backgroundColor: isSelected ? colors.primary : null,
    borderRadius: borderRadius,
    color: textColor,
    cursor: isInteractive ? 'pointer' : 'default',
    display: 'flex',
    flexDirection: 'column',
    fontWeight: isSelected || isToday ? 'bold' : null,
    flexBasis: 'calc(100% / 7)',
    padding: '0.5rem',
    textAlign: 'center',
    width: 'calc(100% / 7)',

    ':hover': {
      backgroundColor: isInteractive && !isSelected ? colors.B.L90 : null,
      color: isInteractive && !isSelected && !isToday ? colors.B.D40 : null,
    },
    ':active': {
      backgroundColor: isInteractive && !isSelected ? colors.B.L80 : null,
    },
  };
});

const TodayMarker = styled.div(({ isSelected }) => ({
  backgroundColor: isSelected ? 'white' : colors.danger,
  borderRadius: 4,
  height: 2,
  marginBottom: -4,
  marginTop: 2,
  width: '1em',
}));

type SelectMonthProps = {
  handleMonthSelect: (any, any, any) => mixed,
  setDate: any => mixed,
  setSelectedDate: any => mixed,
  date: string,
};

class SelectMonth extends React.Component<SelectMonthProps> {
  render() {
    const { handleMonthSelect, setDate, setSelectedDate } = this.props;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const { date } = this.props;

    const onChange = event => {
      handleMonthSelect(event, setDate, setSelectedDate);
    };

    return (
      <select onChange={onChange} value={getMonth(date)}>
        {months.map((month, i) => (
          <option
            key={i}
            value={i}
            //selected={year==currentYear ? true : false}
          >
            {month}
          </option>
        ))}
      </select>
    );
  }
}

type SelectYearProps = {
  handleYearSelect: (any, any, any) => mixed,
  setDate: any => mixed,
  setSelectedDate: any => mixed,
  date: string,
};

class SelectYear extends React.Component<SelectYearProps> {
  render() {
    const { handleYearSelect, setDate, setSelectedDate } = this.props;
    const thisYear = parseInt(new Date().getFullYear());
    const years = [...new Array(101)].map((_, i) => thisYear - i);
    const { date } = this.props;

    const onChange = event => {
      handleYearSelect(event, setDate, setSelectedDate);
    };

    return (
      <select onChange={onChange} value={getYear(date)}>
        {years.map((year, i) => (
          <option
            key={i}
            value={year}
            //selected={year==currentYear ? true : false}
          >
            {year}
          </option>
        ))}
      </select>
    );
  }
}

type DayPickerProps = {
  handleYearSelect: (any, any, any) => mixed,
  handleMonthSelect: (any, any, any) => mixed,
};

export const DayPicker = (props: DayPickerProps) => {
  function BasicCalendar(kalendaryo) {
    const {
      getFormattedDate,
      getWeeksInMonth,
      getDatePrevMonth,
      getDateNextMonth,
      setSelectedDate,
      setDate,
      selectedDate,
      date,
    } = kalendaryo;
    const { handleYearSelect, handleMonthSelect } = props;
    const weeksInCurrentMonth = getWeeksInMonth();

    const setDateNextMonth = () => {
      setDate(getDateNextMonth());
    };

    const setDatePrevMonth = () => setDate(getDatePrevMonth());
    const selectDay = _date => () => setSelectedDate(_date);

    const isSelectedDay = _date => getFormattedDate(selectedDate) === getFormattedDate(_date);
    const isDisabled = dateValue => !isSameMonth(date, dateValue);

    return (
      <Wrapper>
        <Header>
          <HeaderButton onClick={setDatePrevMonth}>
            <ChevronLeftIcon />
          </HeaderButton>
          <SelectMonth
            date={selectedDate}
            handleMonthSelect={handleMonthSelect}
            setDate={setDate}
            setSelectedDate={setSelectedDate}
          />
          <SelectYear
            date={selectedDate}
            handleYearSelect={handleYearSelect}
            setDate={setDate}
            setSelectedDate={setSelectedDate}
          />
          <HeaderButton onClick={setDateNextMonth}>
            <ChevronRightIcon />
          </HeaderButton>
        </Header>

        <Body>
          <WeekLabels>
            {WEEK_DAYS.map(d => (
              <Day key={d}>{d}</Day>
            ))}
          </WeekLabels>
          {weeksInCurrentMonth.map((week, i) => (
            <WeekRow key={i}>
              {week.map(day => {
                const disabled = isDisabled(day.dateValue);
                const isSelected = isSelectedDay(day.dateValue);
                const isToday = isDayToday(day.dateValue);
                return (
                  <Day
                    key={day.label}
                    disabled={disabled}
                    onClick={disabled ? null : selectDay(day.dateValue)}
                    isInteractive={!disabled}
                    isSelected={isSelected}
                    isToday={isToday}
                  >
                    {day.label}
                    {isToday ? <TodayMarker isSelected={isSelected} /> : null}
                  </Day>
                );
              })}
            </WeekRow>
          ))}
        </Body>
      </Wrapper>
    );
  }
  return <Kalendaryo {...props} render={BasicCalendar} />;
};

type Props = {
  children?: Node,
  /** Field disabled */
  isDisabled?: boolean,
  /** Marks this as a required field */
  isRequired?: boolean,
  /** Field name */
  name?: string,
  /** onChange event handler */
  onChange: any => mixed,
  /** Field value */
  value: string,
  /** Ref to apply to the inner Element */
  innerRef: Ref<*>,
  date: string,
  time: string,
  offset: string,
  htmlID: string,
  autoFocus: boolean,
  handleDayChange: any => mixed,
  handleTimeChange: any => mixed,
  handleOffsetChange: any => mixed,
  handleYearSelect: (any, any, any) => mixed,
  handleMonthSelect: (any, any, any) => mixed,
};

export const DateTimePicker = (props: Props) => {
  const { date, time, offset, htmlID, autoFocus, isDisabled, innerRef } = props;
  const {
    handleDayChange,
    handleTimeChange,
    handleOffsetChange,
    handleYearSelect,
    handleMonthSelect,
  } = props;
  const TODAY = new Date();

  const options = [
    '-12',
    '-11',
    '-11',
    '-10',
    '-09',
    '-08',
    '-07',
    '-06',
    '-05',
    '-04',
    '-03',
    '-02',
    '-01',
    '+00',
    '+01',
    '+02',
    '+03',
    '+04',
    '+05',
    '+06',
    '+07',
    '+08',
    '+09',
    '+10',
    '+11',
    '+12',
    '+13',
    '+14',
  ].map(o => ({ value: `${o}:00`, label: `${o}:00` }));
  return (
    <div>
      <DayPicker
        autoFocus={autoFocus}
        onSelectedChange={handleDayChange}
        handleMonthSelect={handleMonthSelect}
        handleYearSelect={handleYearSelect}
        startCurrentDateAt={date ? parse(date) : TODAY}
        startSelectedDateAt={date ? parse(date) : TODAY}
      />
      <Input
        type="time"
        name="time-picker"
        value={time}
        onChange={handleTimeChange}
        disabled={isDisabled || false}
        isMultiline={false}
        innerRef={innerRef}
      />
      <Select
        value={offset}
        options={options}
        onChange={handleOffsetChange}
        id={`react-select-${htmlID}`}
      />
    </div>
  );
};
