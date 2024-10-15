import { checkIfStringIsNotEmtpy } from "../../util/helper";

const RenderFiscalButton = ({ Label, id, isSelected, onClick, periodBtnClass }: any) => {

  let buttonCssClass = !checkIfStringIsNotEmtpy(periodBtnClass)
    ? "btn btn-sm chart_periods pt-1 pb-2 yearly_compare_btn"
    : periodBtnClass;

  return (
    <button
      onClick={onClick}
      className={`${buttonCssClass} ${isSelected ? "selected" : ""
        } `}
      type="button"
    >
      {Label}
    </button>
  );
};

function ChartTimePeriod({
  data,
  labelKey,
  valueKey,
  selected,
  onSelection,
  extraClass,
  periodBtnClass
}: any) {


  return (
    <>
      <div className={`d-flex justify-content-between align-items-start align-items-lg-center flex-lg-row flex-column ${extraClass}`} >
        <div className="d-lg-flex d-block align-items-center float-start my-2-sm w-sm-100 en-row-reverse">
          {data?.map((item: any, index: number) => {
            return (
              // <p>{item[valueKey]}</p>
              <RenderFiscalButton
                key={index}
                Label={item[labelKey]}
                isSelected={selected != undefined ? item[valueKey] == selected[valueKey] : false} //{item[valueKey] ==  selected[valueKey]}
                identifier={valueKey}
                onClick={() => onSelection(item)}
                periodBtnClass={periodBtnClass}
              />
            );
          })}
        </div>
      </div>

    </>

  );
}

export default ChartTimePeriod;
