import { API_URL } from '.';

/**
 *
 * @param start start timestamp in seconds
 * @param end end timestamp in seconds
 * @param page
 * @param pageSize
 * @param hash
 * @returns
 */
export default async function fetchTxns(
    start: number,
    end: number,
    page: number = 1,
    pageSize: number = 50,
    hash?: string,
) {
    const resp = await fetch(
        `${API_URL}//history-txns${hash ? '/' + hash : ''}?start=${start}&end=${end}&page=${page}&pageSize=${pageSize}`,
    ).then((res) => res.json());
    console.log(resp);

    const {
        data,
        pagination,
    }: {
        data: Txn[];
        pagination: Pagination;
    } = resp;

    return {
        txns: data,
        page: pagination.page,
        totalPages: pagination.totalPages,
    };
}
