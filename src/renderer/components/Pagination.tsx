interface PaginationProps {
  currentPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
}

const ITEMS_PER_PAGE = 20;

export const Pagination = ({
  currentPage,
  totalItems,
  paginate,
}: PaginationProps) => {
  const isPrevButtonDisabled = currentPage === 1;
  const isNextButtonDisabled =
    currentPage >= Math.ceil(totalItems / ITEMS_PER_PAGE);

  const nextPage = () => {
    if (!isNextButtonDisabled) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (!isPrevButtonDisabled) {
      paginate(currentPage - 1);
    }
  };

  return (
    <div className="join flex justify-end py-2">
      <button
        className={`join-item btn btn-xs ${
          isPrevButtonDisabled ? 'btn-disabled' : 'btn-accent'
        }`}
        onClick={prevPage}
      >
        Previous
      </button>
      <button
        className={`join-item btn btn-xs ${
          isNextButtonDisabled ? 'btn-disabled' : 'btn-accent'
        }`}
        onClick={nextPage}
      >
        Next
      </button>
    </div>
  );
};
