"use client"
import ChartTimePeriod from '@/components/common/ChartTimePeriod';
import { FiscalPeriodTypesEnum } from '@/constants/GlobalEnums';
import { strings } from '@/constants/localizedStrings';
import { createFiscalPeriods, createFiscalYears, getPieChartYears } from '@/helpers/chart/ChartCommonHelpers';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import { chartTypesConfig } from '@/services/config';
import { fiscals } from '@/util/fiscals';
import { checkIfStringIsNotEmtpy } from '@/util/helper';
import React, { useEffect, useState } from 'react'

export default function useFiscalFilter(chartYear: any, chartPeriod: any, fiscalConfiguration: any) {


    const [selectedFiscalYear, setselectedFiscalYear] = useState(
        fiscals.FiscalYears.find((i: any) => parseInt(i.Value ?? 0) === parseInt(chartYear?.IsSelected ?? 0, 10))
    );

    const [selectedFiscalPeriod, setselectedFiscalPeriod] = useState(
        fiscals.fiscalPeriods.find(
            (i: any) => parseInt(i.Value) === parseInt(chartPeriod?.IsSelected)
        )
    );

    
    const generateDefaultPieChartFiscalPeriod = () => {
        if (selectedFiscalPeriod?.Value == FiscalPeriodTypesEnum.Quarterly) {
            if (fiscalConfiguration?.pieChartData?.pieDefaultQuarterValue) {
                return fiscalConfiguration?.pieChartData?.pieDefaultQuarterValue;
            } else {
                var pieQuarters = fiscals.allFiscalPeriods.filter(x => x.fiscalPeriodTypeId == 3)[0];
                return pieQuarters
            }

        } else if (selectedFiscalPeriod?.Value == FiscalPeriodTypesEnum.Monthly) {
         
            if (fiscalConfiguration?.pieChartData?.pieDefaultMonthValue) {
                return fiscalConfiguration?.pieChartData?.pieDefaultMonthValue;
            } else {
                var pieMonths = fiscals.allFiscalPeriods.filter(x => x.fiscalPeriodTypeId == 2)[0];
                return pieMonths;
            }
        }
    }

    const [selectedFiscalPeriodId, setSelectedFiscalPeriodId] = useState(
        generateDefaultPieChartFiscalPeriod()
    );

    //-- use selectedFiscalPeriodId for any fiscal period id like in 'FiscalPeriods' table. For example if period type is 'Quarter, then set its value to any FiscalPeriodId for quarter.
    //-- If fiscal period type is 'month' then set its value to FiscalPeriodID for month type (see FiscalPeriods and FiscalPeriodTypes tables for understanding)

    const [selectedPieChartYear, setSelectedPieChartYear] = useState<any>({});
    const [pieChartAllPeriods, setPieChartAllPeriods] = useState<any>([]);
    const [pieChartYearsToMap, setPieChartYearsToMap] = useState<any>([]);


    const [apiYears, setApiYears] = useState(
        createFiscalYears(fiscalConfiguration, chartYear)
    );
    const [apiPeriods, setApiPeriods] = useState(
        createFiscalPeriods(fiscalConfiguration, chartPeriod)
    );


    const selectedLanguage = getLocaleFromURL();


    const setFiscalYearOnSelection = (item: any) => {

        setselectedFiscalYear(item);
    }

    const setSelectedFiscalPeriodIdOnChange = (value: any) => {
        const currentFiscalPeriod = fiscals.allFiscalPeriods.find(
            (i: any) => parseInt(i.value) === parseInt(value)
        )
        setSelectedFiscalPeriodId(currentFiscalPeriod);
    }





    useEffect(() => {
        let pieYears = [];

        if (fiscalConfiguration?.pieChartData?.pieChartYearsList?.length > 0) {
            pieYears = fiscalConfiguration?.pieChartData?.pieChartYearsList;

        } else {
            pieYears = getPieChartYears(25);
        }



        if ((fiscalConfiguration?.isFullView == true || fiscalConfiguration?.isCopyLinkFullView == true) && checkIfStringIsNotEmtpy(fiscalConfiguration.fullViewSelectedPieChartYear)) {
            pieYears.forEach(function (item: any) {
                item.isSelected = false;
                if (parseInt(item.value ?? 0) === parseInt(fiscalConfiguration?.fullViewSelectedPieChartYear ?? 0)) {
                    item.isSelected = true;
                }
            });
        }

        setPieChartAllPeriods(getPieChartPeriod() ?? []);


        setPieChartYearsToMap(pieYears ?? []);
        setSelectedPieChartYear({ value: pieYears?.find((x: { isSelected: boolean; }) => x.isSelected == true)?.value });

     

    }, [fiscalConfiguration?.pieChartData?.pieChartYearsList]);



    //--Do not add any other operation in this useEffect.
    useEffect(() => {

        //--Only execute if selectedFiscalYear == undefined and chartYear != undefined otherwise it will effect whole functioality where this hook used.
        if (selectedFiscalYear == undefined && chartYear != undefined) {
            setselectedFiscalYear(fiscals.FiscalYears.find((i: any) => parseInt(i.Value ?? 0) === parseInt(chartYear?.IsSelected ?? 0, 10)));
        }

        //--Only execute if selectedFiscalPeriod == undefined and chartPeriod != undefined otherwise it will effect whole functioality where this hook used.
        if (selectedFiscalPeriod == undefined && chartPeriod != undefined) {
            setselectedFiscalPeriod(
                fiscals.fiscalPeriods.find(
                    (i: any) => parseInt(i.Value ?? 0) === parseInt(chartPeriod?.IsSelected ?? 0)
                )
            );
        }

        //--Only execute if selectedPieChartYear == undefined and fiscalConfiguration?.fullViewSelectedPieChartYear != undefined otherwise it will effect whole functioality where this hook used.
        if ((selectedPieChartYear == undefined || selectedPieChartYear?.value == undefined) && (fiscalConfiguration?.fullViewSelectedPieChartYear != undefined && fiscalConfiguration?.fullViewSelectedPieChartYear != "")) {
            setSelectedPieChartYear({ value: fiscalConfiguration?.fullViewSelectedPieChartYear });
        }

        //--Only execute if apiYears == undefined and chartYear?.years != undefined otherwise it will effect whole functioality where this hook used.
        if ((apiYears == undefined || apiYears.length == 0) && (chartYear?.years != undefined && chartYear?.years.length > 0)) {
            setApiYears(createFiscalYears(fiscalConfiguration, chartYear));
        }

        //--Only execute if apiPeriods == undefined and chartPeriod?.periods != undefined otherwise it will effect whole functioality where this hook used.
        if ((apiPeriods == undefined || apiPeriods.length == 0) && (chartPeriod?.periods != undefined && chartPeriod?.periods.length > 0)) {
            setApiPeriods(createFiscalPeriods(fiscalConfiguration, chartPeriod));
        }

       



    }, []);
    //}, [chartYear, chartPeriod, fiscalConfiguration?.fullViewSelectedPieChartYear]);


    //-- below use effect is only for pie chart month, quarter setting
    useEffect(() => {
        setSelectedFiscalPeriodId(generateDefaultPieChartFiscalPeriod() ?? {})
    }, [selectedFiscalPeriod])
    

    const render = () => {
        return <>

            {
                fiscalConfiguration?.chartType != undefined && fiscalConfiguration?.chartType == chartTypesConfig.PIE
                    ?
                    <div className='pie-chart-main-div'>

                        <div className="select-pie-container mt-1 mt-lg-0" style={{ display: "flex" }}>


                            {
                                apiPeriods != undefined && apiPeriods.length > 0
                                    ?
                                    <select className='form-select'

                                        onChange={(val) =>
                                            setSelectedPieChartYear({
                                                value: val.target.value,
                                            })
                                        }

                                    >

                                        {
                                            pieChartYearsToMap?.length ? (
                                                pieChartYearsToMap.map((item: any, ind: number) => {
                                                    return (
                                                        <option
                                                            key={ind}
                                                            selected={
                                                                item.isSelected == true

                                                            }
                                                            value={item.value}
                                                        >
                                                            {item.value}
                                                        </option>
                                                    );
                                                })
                                            ) : (
                                                <option selected value={0}>
                                                    {strings.nodata}
                                                </option>
                                            )
                                        }

                                    </select>
                                    :
                                    <>
                                    </>
                            }


                            {
                                selectedFiscalPeriod?.Value == FiscalPeriodTypesEnum.Quarterly || selectedFiscalPeriod?.Value == FiscalPeriodTypesEnum.Monthly
                                    ?
                                    <select className='form-select mx-2'
                                       value={selectedFiscalPeriodId?.value}
                                        onChange={(val) =>
                                            setSelectedFiscalPeriodIdOnChange(val.target.value)
                                        }

                                    >

                                        {
                                            pieChartAllPeriods?.length ? (
                                                pieChartAllPeriods?.filter((x: { fiscalPeriodTypeId: number; }) => x.fiscalPeriodTypeId == selectedFiscalPeriod?.Value)?.map((item: any, ind: number) => {
                                                    return (
                                                        <option
                                                            key={ind}
                                                            selected={
                                                                item.value ==
                                                                selectedFiscalPeriodId?.Value
                                                            }
                                                            value={item.value}
                                                        >
                                                            {selectedLanguage == "en"
                                                                ? item.label
                                                                : item.labelAr}
                                                        </option>
                                                    );
                                                })
                                            ) : (
                                                <option selected value={0}>
                                                    {strings.nodata}
                                                </option>
                                            )
                                        }


                                    </select>
                                    :
                                    <>
                                    </>
                            }

                           



                        </div>

                        <div className='period-chart-tab mt-2 mt-lg-1 mb-lg-0'>
                            <ChartTimePeriod
                                extraClass={"period"}
                                data={apiPeriods}
                                labelKey={
                                    selectedLanguage == 'ar' ? "LabelAr" : "LabelEn"
                                }
                                valueKey={"Value"}
                                selected={selectedFiscalPeriod}
                                onSelection={(item: any) => setselectedFiscalPeriod(item)}
                            />
                        </div>

                    </div>
                    :
                    <>






                        <div className='custom_flex_col'>
                            <div className="d-flex justify-content-between">

                                <div className="year-chart-tab">
                                    <ChartTimePeriod
                                        data={apiYears}
                                        labelKey={selectedLanguage == 'ar' ? "YearAr" : "YearEn"}
                                        valueKey={"Value"}
                                        selected={selectedFiscalYear}
                                        onSelection={(item: any) => setFiscalYearOnSelection(item)}
                                        periodBtnClass={"btn btn-sm chart_periods py-3 yearly_compare_btn"}
                                    />
                                </div>

                            </div>

                            <div className="period-chart-tab mt-2 mt-lg-1 mb-lg-0">
                                <ChartTimePeriod
                                    extraClass={"period"}
                                    data={apiPeriods}
                                    labelKey={
                                        selectedLanguage == 'ar' ? "LabelAr" : "LabelEn"
                                    }
                                    valueKey={"Value"}
                                    selected={selectedFiscalPeriod}
                                    onSelection={(item: any) => setselectedFiscalPeriod(item)}
                                    periodBtnClass={"btn btn-sm chart_periods pt-1 pb-2"}
                                />
                            </div>
                        </div>

                    </>

            }








        </>
    }

    return (
        {
            render, selectedFiscalPeriod, selectedFiscalYear,
            selectedOthereFiscalData: {
                selectedPieChartYear: selectedPieChartYear, selectedFiscalPeriodId: selectedFiscalPeriodId,
                apiYears: apiYears, apiPeriods: apiPeriods
            }
        }
    )
}


export const getPieChartPeriod = () => {
    return fiscals.allFiscalPeriods;
}
