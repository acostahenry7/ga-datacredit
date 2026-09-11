import React from "react";
import { FaCircleXmark } from "react-icons/fa6";

const ConfirmationModal = ({
  desc,
  condition,
  onClose,
  onSend,
  checked,
  onToggleCondition,
}) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.3)] z-20 flex items-center justify-center">
      <div className="w-auto h-auto bg-white rounded-md p-4 relative min-w-[600px]">
        {/* <FaCircleXmark
          className="absolute size-5 right-3 top-3 text-red-600 cursor-pointer"
          onClick={onClose}
        /> */}
        <div>
          <h3 className="text-base font-medium text-text-primary tracking-wide">
            ¿Seguro que deseas realizar esta acción?
          </h3>
        </div>
        <div className="bg-gray-100 border-dashed border border-gray-400 text-sm text-slate-600 rounded-md p-3 mt-2">
          <span>
            {desc || "Esta acción es riesgosa, favor proceder con precaución"}
          </span>
        </div>
        {checked && (
          <div className="bg-yellow-100 border-dashed border border-yellow-600 text-sm text-yellow-700 font-medium rounded-md p-2 mt-2">
            <span className="text-sm">
              No es recomendado utilizar esta opción. La misma invalida las
              sugerencias del MRP
            </span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <input
            id="condition"
            type="checkbox"
            className="size-4 cursor-pointer"
            checked={checked}
            onChange={onToggleCondition}
          />
          <label
            className="text-xs text-center font-medium cursor-pointer"
            htmlFor="condition"
          >
            {condition || "Condicion"}
          </label>
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <button
            className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-800 duration-200 font-medium"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-black text-white px-2 py-1 rounded-md hover:bg-red-600 duration-200 font-medium"
            onClick={onSend}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
