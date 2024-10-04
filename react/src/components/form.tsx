import { useMutation, useQueryClient } from '@tanstack/react-query';
import DatePickerWithRange from './date-picker-with-range';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import useSearchParams from '@/hooks/use-search-params';

function Form() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const params = useSearchParams();
  const page = parseInt(params.get('page') ?? '1');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      start: number;
      end: number;
      page: number;
      pageSize: number;
      hash: FormDataEntryValue | undefined;
    }) => {
      return data;
    },
    onSuccess: (variables) => {
      const { start, end, page, pageSize, hash } = variables;
      queryClient.invalidateQueries({
        queryKey: ['txns', start, end, page, pageSize, hash],
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Submitting form');
    const formData = new FormData(e.currentTarget);
    const start =
      (date?.from?.getTime() ?? Date.now() - 1000 * 60 * 60 * 24 * 30) / 1000;
    const end = (date?.to?.getTime() ?? Date.now()) / 1000;
    const pageSize = parseInt(formData.get('page-size') as string);
    const hash = formData.get('hash') || undefined;
    history.pushState(
      null,
      '',
      `?start=${Math.floor(start)}&end=${Math.floor(end)}&page=${page}&pageSize=${pageSize}&hash=${hash ?? ''}`,
    );
    window.dispatchEvent(new Event('locationchange'));
    mutation.mutate({ start, end, page, pageSize, hash });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
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
          <Button
            type="submit"
            className="w-32 justify-self-center rounded-none"
          >
            Search
          </Button>
        </div>
      </form>
    </>
  );
}

export default Form;
