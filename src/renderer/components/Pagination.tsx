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
  const nextPage = () => {
    if (currentPage < Math.ceil(totalItems / ITEMS_PER_PAGE)) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };
  return (
    <div className="join flex justify-end py-2">
      <button className="join-item btn btn-accent btn-xs" onClick={prevPage}>
        Previous
      </button>
      <button className="join-item btn btn-accent btn-xs" onClick={nextPage}>
        Next
      </button>
    </div>
  );
};
