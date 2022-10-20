import React from 'react';
import SvgIcons from './SvgIcons';

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
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-row gap-3 justify-center items-center"
      >
        <input
          className="p-2 md:p-3 rounded-full focus:outline-none focus:ring h-12
               focus:ring-main-purple/50 invalid:focus:ring-red-600 border-2 hover:border-main-purple invalid:hover:border-red-600"
          type="search"
          name="search-params"
          value={searchParameters}
          onChange={handleChange}
          placeholder="Search"
          ref={searchRef}
          //Check for null, js treats null as object
          autoFocus={typeof isRenderedMobile !== 'object'}
          onBlur={() => setIsRenderedMobile(false)}
        />
        <button className="w-fit h-full flex justify-center items-center p-2 border-4 rounded-full border-main-purple">
          <SvgIcons type="search" className="fill-main-purple h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default SearchOverlay;
