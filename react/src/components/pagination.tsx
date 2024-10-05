import { mergeSearchParams } from '@/utils/merge-search-params';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';

type PaginationProps = {
  page: number;
  totalPages: number;
};

function Pagination({ page, totalPages }: PaginationProps) {
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center gap-4 pr-4">
      <Button
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ['txns'],
          });
          const params = new URLSearchParams(window.location.search);
          const page = parseInt(params.get('page') ?? '1');
          const nextUrl = mergeSearchParams(
            params.toString(),
            `page=${page - 1}`,
          );
          history.pushState(null, '', `?${nextUrl}`);
          window.dispatchEvent(new Event('locationchange'));
        }}
        className="h-8 px-2 py-1"
        disabled={page === 1}
      >
        Prev
      </Button>
      <span>
        {page} / {totalPages}
      </span>
      <Button
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ['txns'],
          });
          const params = new URLSearchParams(window.location.search);
          const page = parseInt(params.get('page') ?? '1');
          const nextUrl = mergeSearchParams(
            params.toString(),
            `page=${page + 1}`,
          );
          history.pushState(null, '', `?${nextUrl}`);
          window.dispatchEvent(new Event('locationchange'));
        }}
        className="h-8 px-2 py-1"
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
