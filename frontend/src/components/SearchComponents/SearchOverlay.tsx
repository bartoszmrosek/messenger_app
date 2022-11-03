import React from 'react';

interface SearchOverlayProps {
  handleSearchSubmit: (event: React.SyntheticEvent) => void;
  searchParameters: string;
  handleChange: (inputValue: React.FormEvent<HTMLInputElement>) => void;
  searchRef: React.RefObject<HTMLInputElement>;
  isRenderedMobile: boolean | null;
  setIsRenderedMobile: React.Dispatch<React.SetStateAction<boolean | null>>;
  setSearchOverlayOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchOverlay = ({
  handleSearchSubmit,
  searchParameters,
  handleChange,
  searchRef,
  isRenderedMobile,
  setIsRenderedMobile,
  setSearchOverlayOpened,
}: SearchOverlayProps) => {
  const onBlurHandler = () => {
    setIsRenderedMobile(false);
    setSearchOverlayOpened(false);
  };
  return (
    <div
      className={`transition duration-1000 h-screen w-screen bg-black/30 absolute left-0 bottom-0 flex justify-center items-center ${
        isRenderedMobile
          ? 'opacity-100 pointer-events-auto'
          : ' opacity-0 pointer-events-none'
      }`}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-row gap-3 justify-center items-center"
        onBlur={onBlurHandler}
        onFocus={() => setSearchOverlayOpened(true)}
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
        />
      </form>
    </div>
  );
};

export default SearchOverlay;
