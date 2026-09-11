import React from "react";
import Button from "./Button";
import { BiSearch } from "react-icons/bi";
import DtFilterWrapper from "./DtFilterWrapper";
import SearchSelect from "./SearchSelect";

const DtFilter = ({ form, data, variant }) => {
  const currentYear = new Date().getFullYear();

  const getYearListFromYear = (targetYear) => {
    return Array(11)
      .fill(0)
      .map((item, index) => targetYear - index);
  };

  return (
    <DtFilterWrapper className="">
      <FilterWrapper>
        <label htmlFor="">Búsqueda</label>
        <input
          className="filter-input"
          placeholder="Buscar..."
          value={form.values.searchField}
          onChange={(e) => form.setFieldValue("searchField", e.target.value)}
        />
      </FilterWrapper>
      <FilterWrapper>
        <label htmlFor="">Marca</label>
        <select
          className="filter-input"
          value={form.values.brandId}
          onChange={(e) => form.setFieldValue("brandId", e.target.value)}
        >
          <option value="">Todas</option>
          {data?.brands?.map((item) => (
            <option key={item.U_brand_id} value={item.U_brand_id}>
              {item.U_description}
            </option>
          ))}
        </select>
      </FilterWrapper>
      <FilterWrapper>
        <label htmlFor="">Proveedor</label>
        {/* <select
          className="filter-input"
          value={form.values.brandId}
          onChange={(e) => form.setFieldValue("brandId", e.target.value)}
        >
          <option value="">Todas</option>
          {data.providers?.map((item) => (
            <option key={item.CardCode} value={item.CardCode}>
              {item.CardName}
            </option>
          ))}
        </select> */}
        <SearchSelect
          options={data.providers}
          fields={{ key: "CardCode", value: "CardName" }}
          variant="FILTER"
          onChange={() => {}}
        />
      </FilterWrapper>
      <FilterWrapper>
        <label htmlFor="">Fecha sugerido</label>
        <div className="flex gap-2 flex-wrap mt-3 sm:mt-0 sm:pl-0">
          <div className="flex items-center">
            {/* <label className="w-12">Desde</label> */}
            <div>
              <select
                className="filter-input ml-2"
                name=""
                value={form.values.targetYear}
                onChange={(e) =>
                  form.setFieldValue("targetYear", e.target.value)
                }
              >
                <option value="">Todos</option>
                {getYearListFromYear(currentYear).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                className="filter-input ml-2"
                name=""
                value={form.values.targetMonth}
                onChange={(e) =>
                  form.setFieldValue("targetMonth", e.target.value)
                }
              >
                <option value="">Todos</option>
                {Array(12)
                  .fill(0)
                  .map((i, index) => (
                    <option key={index} value={index + 1}>
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {/* <div className="flex items-center">
            <label className="w-12">Hasta</label>
            <div>
              <select className="filter-input ml-2" name="" id="">
                {getYearListFromYear(currentYear + 1).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select className="filter-input ml-2" name="" id="">
                {Array(12)
                  .fill(0)
                  .map((i, index) => (
                    <option key={index} value={index + 1}>
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </option>
                  ))}
              </select>
            </div>
          </div> */}
        </div>
      </FilterWrapper>

      <div className="self-end justify-end mb-1 w-full sm:w-[172px]">
        <Button
          title={"Buscar"}
          variant="light"
          width={"100%"}
          icon={<BiSearch size={16} />}
          onClick={form.handleSubmit}
          type={"submit"}
        />
      </div>
    </DtFilterWrapper>
  );
};

export const FilterWrapper = ({ children }) => {
  return (
    <div className="sm:w-auto w-full flex flex-col justify-center">
      {children}
    </div>
  );
};

export default DtFilter;
