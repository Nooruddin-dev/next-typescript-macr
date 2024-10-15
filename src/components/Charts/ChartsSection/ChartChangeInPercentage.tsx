import { strings } from '@/constants/localizedStrings';
import { getChartChangeInPercentageApi } from '@/helpers/apiService';
import { getLocaleFromURL } from '@/Routes/routeHelper';
import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';

export default function ChartChangeInPercentage(
    {
        changePercentageFieldId,
        selectedFiscalYear
    }: any
) {
    const [resourceValue, setResourceValue] = useState(0);
    const selectedLanguage =  getLocaleFromURL();


    useEffect(() => {
        getChartChangeInPercentage();
    }, []);

    const getChartChangeInPercentage = () => {
        getChartChangeInPercentageApi(changePercentageFieldId)
            .then((res: any) => {

                if (res.data != undefined && res.data.length > 0) {
                    setResourceValue(parseFloat(res?.data[0]?.Resource ?? 0));
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        <>
            {
                parseInt(selectedFiscalYear?.Value ?? 0) === 10
                    ?
                    <div className=" dir_txt">
                        <span>
                            {
                                selectedLanguage == "ar"
                                    ?
                                    'نسبة التغير 10 سنوات: ' //--For the arabic, I use hard coded text here instead of localization bcz it was not working when copy and paste link in full view.
                                    :
                                    strings.changeInTenYears
                            }
                        </span>
                        <span
                            className={resourceValue != undefined && resourceValue < 0 ? `negative-resource-value dir_ltr d-inline-block` : `positive-resource-value dir_ltr d-inline-block`}
                        >
                            {
                                resourceValue != undefined && resourceValue > 0
                                    ?
                                    `${resourceValue}%`
                                    :
                                    `(${Math.abs(resourceValue ?? 0)}%)`
                            }
                        </span>



                    </div>
                    :
                    <>
                    </>
            }



        </>
    )
}
