import DatePickerWithRange from './date-picker-with-range';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

function Form() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  return (
    <>
      <form
        onSubmit={(e) => {
          const start =
            date?.from?.getTime() ?? Date.now() - 1000 * 60 * 60 * 24 * 30;
          const end = date?.to?.getTime() ?? Date.now();
          e.preventDefault();
          history.pushState(null, '', `?start=${start}&end=${end}`);
        }}
      >
        <div className="grid max-w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="hash">Txn Hash</Label>
            <Input id="hash" placeholder="Your Hash 0x" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date-range">Date Range</Label>
            <DatePickerWithRange
              id="date-range"
              date={date}
              setDate={setDate}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="page-size">Page Size</Label>
            <Input
              id="page-size"
              name="page-size"
              type="number"
              min={10}
              max={50}
              defaultValue={50}
            />
          </div>
          <Button className="w-32 justify-self-center rounded-none">
            Search
          </Button>
        </div>
      </form>
    </>
  );
}

export default Form;
