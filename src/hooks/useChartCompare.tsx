
"use client"
import { strings } from '@/constants/localizedStrings';
import { createEconomicFieldIndicatorArray } from '@/helpers/chart/ChartCommonHelpers';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import { chartTypesConfig } from '@/services/config';
import React, { useEffect, useState } from 'react'

export default function useChartCompare(comparableFields: any, economicIndicatorFieldID: any, defaultSelectedCompareFieldsIds: any, compareConfiguration:any) {


    const economicIndicatorFieldIDArray = createEconomicFieldIndicatorArray(economicIndicatorFieldID);

    const [selectedCompareField, setSelectedCompareField] = useState(
        comparableFields?.find((item: any) => economicIndicatorFieldIDArray?.includes(parseInt(item.fieldId ?? 0)))
    );
    const [selectedCompareFieldIds, setSelectedCompareFieldIds] = useState(
        defaultSelectedCompareFieldsIds ?? []
    );
    const [selectedModifiedComparableFields, setSelectedModifiedComparableFields] = useState(
        []
    );
    const [showCompare, setShowCompare] = useState(false);

    const selectedLanguage = getLocaleFromURL();

    const handleCompareFieldClick = (item: any) => {
        // Check if the fieldId is already selected, if yes, remove it, else add it to the selection
        setSelectedCompareFieldIds((prevSelectedIds: any) =>
            prevSelectedIds.includes(item?.fieldId)
                ? prevSelectedIds.filter((id: any) => id !== item?.fieldId)
                : [...prevSelectedIds, item?.fieldId]
        );


        setSelectedCompareField(item);
    };

    const bringDefaultFieldIdToTop = (data: any, defaultFieldIdArray: any) => {

        try {
            const sortedData = [...data];
            const indexToMove = sortedData?.findIndex((item) => defaultFieldIdArray?.includes(parseInt(item.fieldId ?? 0)));


            if (indexToMove !== -1) {
                const fieldToMove = sortedData?.splice(indexToMove, 1)[0];
                sortedData.unshift(fieldToMove);
            }


            //--If there is only one record in array and if it is equal to defaultFieldId then no need to show the compare div
            if (sortedData != undefined && sortedData != null && sortedData.length === 1) {
                if (sortedData?.some(item => defaultFieldIdArray?.includes(parseInt(item.fieldId ?? 0)))) {
                    return [];
                }
            }


            if (sortedData != undefined && sortedData.length > 4) {
                return sortedData.slice(0, 4);
            } else {
                return sortedData;
            }

        } catch (error) {

            console.error('Error in sorting compare companies for char: ', error); // Console log the error object
            return data;
        }



    };





    useEffect(() => {

        const modifiedComparableFields = bringDefaultFieldIdToTop(comparableFields ?? [], (economicIndicatorFieldIDArray ?? []));
        setSelectedModifiedComparableFields(modifiedComparableFields);
        if ((modifiedComparableFields != undefined && modifiedComparableFields.length > 0
            && (compareConfiguration?.defaultComparable == false)
            && (compareConfiguration?.chartType != chartTypesConfig.PIE)
        )) {
            setShowCompare(true);
        }
    }, []);


    const renderChartCompare = () => {
        return <>
            {
                (showCompare == true && selectedModifiedComparableFields != undefined
                    && selectedModifiedComparableFields.length > 0
                )

                    ?
                    <>
                        <div className="border p-2 compare_widget pt-1 pb-1 pt-lg-2 pb-lg-2">
                            <div className="d-lg-flex align-items-center fullview_justify_content justify-content-start">
                                {
                                    compareConfiguration?.showTitle != undefined && compareConfiguration?.showTitle == true
                                        ?
                                        <span className="compare_subhead mb-0"> {strings.compareLabel} </span>
                                        :
                                        <>
                                        </>
                                }


                                <div className="position-relative align-middle d-lg-flex flex-wrap float-end sm_w_full" role="group" aria-label="Titles">

                                    {selectedModifiedComparableFields.map((item: any) => (


                                        economicIndicatorFieldIDArray != undefined && economicIndicatorFieldIDArray.includes(parseInt(item.fieldId ?? 0))

                                            ?
                                            <div key={item.fieldId}
                                                className={`chart-compare-btn  compare_selected`}
                                            >
                                                {/* <a className="text-center m-0 fs-7 d-block"

                                                >
                                                    {selectedLanguage == 'en' ? item.fieldNameEn : item.fieldNameAr}
                                                </a> */}
                                                <a className="text-lg-center m-0 d-block comparetooltip tooltip-bottom" data-tooltip={selectedLanguage === "en" ? item.fieldNameEn : item.fieldNameAr}

                                                >
                                                    <span className='compare_text'>{selectedLanguage == 'en' ? item.fieldNameEn : item.fieldNameAr}</span>
                                                </a>

                                            </div>
                                            :
                                            <>
                                                <div key={item.fieldId}
                                                    className={`chart-compare-btn  ${selectedCompareFieldIds.includes(item?.fieldId) ? 'compare_selected' : ''}`}
                                                >
                                                    <a className="text-center m-0 fs-7 d-block comparetooltip tooltip-bottom" data-tooltip={selectedLanguage === "en" ? item.fieldNameEn : item.fieldNameAr}
                                                        onClick={() => handleCompareFieldClick(item)}
                                                    // onClick={()=>alert(economicIndicatorFieldID + ',' +  item?.fieldId)}
                                                    >
                                                        {/* {selectedLanguage == 'en' ? item.fieldNameEn : item.fieldNameAr} */}
                                                        <span className='compare_text'>{selectedLanguage == 'en' ? item.fieldNameEn : item.fieldNameAr}</span>
                                                    </a>
                                                    {/* 
                                                    <a className="text-lg-center m-0 fs-7 d-block comparetooltip tooltip-bottom" data-tooltip={selectedLanguage === "en" ? item.fieldNameEn : item.fieldNameAr}
                                                        onClick={() => handleCompareFieldClick(item)}
                                                    >
                                                        <span className='compare_text'>{selectedLanguage == 'en' ? item.fieldNameEn : item.fieldNameAr}</span>
                                                    </a> */}

                                                </div>
                                            </>

                                    ))}


                                </div>
                            </div>
                        </div>
                    </>
                    :

                    <>

                    </>
            }

        </>


    }

    return (
        {
            renderChartCompare, selectedCompareField, selectedCompareFieldIds,
            selectedOtherCompareData: { showCompare: showCompare }
        }
    )


}
