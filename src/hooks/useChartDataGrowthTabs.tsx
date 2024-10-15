
"use client"
import { createDataFilter } from '@/helpers/chart/ChartCommonHelpers';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import { fiscals } from '@/util/fiscals';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function useChartDataGrowthTabs(dataFilters: any, fiscalConfiguration: any) {
  
  const [selectedGrowthButton, setSelectedGrowthButton] = useState(
    fiscals.DataFilters.find((i: any) => parseInt(i.Value ?? 0) === parseInt(dataFilters?.IsSelected ?? 0))
  );


  const [dataYears, setDataYears] = useState(
    createDataFilter(dataFilters, fiscalConfiguration)
  );

  const selectedLanguage =  getLocaleFromURL();



  const handleSelectedGrowthButton = (e: any, item: any) => {
    e.preventDefault()
    setSelectedGrowthButton(item);
  }





  const chartDataGrowthHtml = () => {
    return <>

      <div className="period-chart-tab data_chart_tab mt-2 mt-lg-3 mb-lg-0">
        <div className="d-flex justify-content-between align-items-start align-items-lg-center flex-lg-row flex-column period">
          <div className="d-lg-flex d-block align-items-center float-start my-2-sm w-sm-100 en-row-reverse">

            {dataYears?.map((item: any, index: number) => {
              return (
                <button
                  className={`btn btn-sm chart_periods pt-1 pb-2 ${selectedGrowthButton?.Value === item?.Value ? 'selected' : ''}`}
                  onClick={(e) => handleSelectedGrowthButton(e, item)}
                >
                  {selectedLanguage == 'ar' ? item?.NameAr : item?.NameEn}
                </button>
              );
            })}

          

          </div>
        </div>
      </div>

    </>
  }

  return (
    {
      chartDataGrowthHtml, selectedGrowthButton
    }
  )
}

