import { useState } from 'react';

interface PaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

/**
 * A custom hook for handling pagination.
 *
 * @param {T[]} items - The array of items to paginate.
 * @param {number} itemsPerPage - The maximum number of items per page.
 *
 * @returns {PaginationResult<T>} An object with the following properties:
 * - currentItems: The items for the current page.
 * - currentPage: The current page number.
 * - paginate: A function to change the current page.
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage: number
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return { currentItems, currentPage, paginate };
}
