import { useState, useEffect, useRef } from "react";

const SearchSelect = ({
  customId = "",
  options,
  placeholder = "Selecciona una opcion",
  defaultValue,
  fields,
  variant = "FILTER",
  onChange,
  multiple = false,
}) => {
  const [search, setSearch] = useState(defaultValue || "");
  const [filteredOptions, setFilteredOptions] = useState([...options]);
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [seeAll, setSeeAll] = useState(true);
  const dropdownRef = useRef(null);

  const variants = {
    FILTER: {
      inputClasses: `filter-input w-full sm:min-w-[400px]`,
      dropdownClasses: `absolute filter-input overflow-y-auto rounded shadow-lg z-50 h-auto max-h-[220px] bg-slate-50`,
    },
    INPUT: {
      inputClasses: `form-input`,
      dropdownClasses: `absolute filter-input overflow-y-auto rounded shadow-lg z-50 h-auto max-h-[220px] bg-slate-50 w-full`,
    },
  };

  useEffect(() => {
    setFilteredOptions(
      [...options].filter((option) => {
        let targetText =
          option[fields.key]?.toLowerCase() +
          " " +
          option[fields.value]?.toLowerCase();

        if (multiple) {
          let searchedText = search.split(",");
          //return searchedText.some((keyword) => targetText.includes(keyword));

          return targetText.includes(
            searchedText[searchedText.length - 1]?.toLowerCase()
          );
        } else {
          return targetText.includes(search?.toLowerCase());
        }
      })
    );
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (!multiple) {
      setSelected(option);
      setSearch(option[fields.value]);
      setIsOpen(false);
    } else {
      let newOptions = [...filteredOptions];
      newOptions.map((item) => {
        if (item[fields.key] == option[fields.key]) {
          if (!item.selected) {
            // setSearch((prev) => {
            //   let text = "";
            //   if (prev) {
            //     if (prev?.charAt(prev.length - 1) != ",") {
            //       text = prev.slice(0, prev.lastIndexOf(",") + 1);
            //       return (text += option[fields.value] + ",");
            //     }
            //   }

            //   return prev + option[fields.value] + ",";
            // });
            setSearch("");
          }
          item.selected = !item.selected;
        }
      });
      setFilteredOptions(newOptions);
      //setSelected(newOptions.filter((item) => item.selected));
    }
  };

  const handleSelectAll = () => {
    let newOptions = [...filteredOptions];
    newOptions.map((item) => {
      item.selected = true;
    });

    setFilteredOptions(newOptions);
    //setSelected((prev) => [newOptions.filter((item) => item.selected)]);
    //setSearch("");
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const toggleShowSelectedAll = () => {
    if (seeAll) {
      let selected = [...filteredOptions].filter((item) => item.selected);
      setFilteredOptions(selected);
    } else {
      setFilteredOptions([...options]);
    }

    setSeeAll((prev) => !prev);
  };

  useEffect(() => {
    setSelected([...options].filter((item) => item.selected == true));
  }, [filteredOptions]);

  //multiple && console.log(options);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        id={customId}
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClick={() => setIsOpen(true)}
        placeholder={selected ? selected.label : placeholder}
        className={variants[variant].inputClasses}
        autoComplete="off"
      />

      {multiple && (
        <div className="absolute top-[20px] right-10">
          <span
            className="text-blue-400 ml-2 cursor-pointer text-sm "
            onClick={handleSelectAll}
          >
            Seleccionar filtrados
          </span>{" "}
          <span
            className="text-blue-400 ml-2 cursor-pointer text-sm"
            onClick={toggleShowSelectedAll}
          >
            Ver {seeAll ? "seleccionados" : "Todos"}
          </span>
        </div>
      )}
      {isOpen && (
        <ul className={variants[variant].dropdownClasses}>
          {/* {multiple && (
            <li className="p-2 hover:bg-gray-200 cursor-pointer text-sm">
              Todos
            </li>
          )} */}
          {filteredOptions.length > 0 ? (
            filteredOptions
              .filter((opt) => opt[fields.value] != "")
              .map((option) => (
                <li
                  key={option[fields.key]}
                  onClick={() => handleSelect(option)}
                  className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                >
                  <div className="flex items-center justify-start gap-2">
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={option.selected}
                        className="size-4 rounded-sm border-none pointer-events-none"
                        readOnly
                      />
                    )}
                    {fields.keyOnLabel ? option[fields.key] + " - " : ""}
                    {option[fields.value]}
                  </div>
                </li>
              ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchSelect;

// Ejemplo de uso
// const App = () => {
//   const options = [
//     { value: "apple", label: "Apple" },
//     { value: "banana", label: "Banana" },
//     { value: "orange", label: "Orange" },
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="mb-2 text-lg font-semibold">Custom Select with Search</h2>
//       <CustomSelect options={options} />
//     </div>
//   );
// };

// export default App;
