import React from 'react';

interface SearchOverlayProps {
  handleSearchSubmit: (event: React.SyntheticEvent) => void;
  searchParameters: string;
  handleChange: (inputValue: React.FormEvent<HTMLInputElement>) => void;
  searchRef: React.RefObject<HTMLInputElement>;
  isRenderedMobile: boolean | null;
  setIsRenderedMobile: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const SearchOverlay = ({
  handleSearchSubmit,
  searchParameters,
  handleChange,
  searchRef,
  isRenderedMobile,
  setIsRenderedMobile,
}: SearchOverlayProps) => {
  const shouldAnimate = () => {
    if (isRenderedMobile === null) return '';
    if (isRenderedMobile) {
      return 'animate-search-fade-in';
    } else {
      return 'animate-search-fade-out';
    }
  };
  return (
    <div
      className={`h-screen w-screen bg-black/30 absolute left-0 bottom-0 flex justify-center items-center translate-y-[-100%] ${shouldAnimate()}`}
    >
      <form onSubmit={handleSearchSubmit}>
        <input
          className="p-2 md:p-3 rounded-full focus:outline-none focus:ring
               focus:ring-main-purple/50 invalid:focus:ring-red-600 border-2 hover:border-main-purple invalid:hover:border-red-600"
          type="search"
          name="search-params"
          value={searchParameters}
          onChange={handleChange}
          placeholder="Search"
          ref={searchRef}
          autoFocus={typeof isRenderedMobile !== 'object'}
          onBlur={() => setIsRenderedMobile(false)}
        />
      </form>
    </div>
  );
};

export default SearchOverlay;
