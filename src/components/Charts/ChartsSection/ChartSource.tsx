import React from 'react'
import { strings } from '../../../constants/localizedStrings'
import { useSelector } from 'react-redux';
import { getLocaleFromURL } from '@/Routes/routeHelper';

export default function ChartSource(
    {
        isfullView,
        sourcesToDisplay
    }: any
) {
    const selectedLanguage = getLocaleFromURL();

    return (
        <>
            {
                isfullView == true
                    ?

                    sourcesToDisplay && sourcesToDisplay.length > 0 ? (
                        <div className='d-lg-inline-flex d-inline-flex position-relative chart_source'>
                            <div className="source_main">
                                {sourcesToDisplay?.map((source: any, index: number) => (
                                    <React.Fragment key={index}>
                                        {/* <span className="me-1">
                                        
                                            {selectedLanguage == 'ar' ? 'المصدر: ' : 'Source: '} 
                                        </span> */}

                                        {source.source}
                                        {/* Add the pipe separator only if it is not the last element */}
                                        {index < sourcesToDisplay.length - 1 && <span className="source_sep">  </span>}
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                    ) : null

                    :

                    sourcesToDisplay && sourcesToDisplay.length > 0 ? (
                        <div className="d-inline-flex align-items-cener position-relative chart_source mb-0">
                            <div className="source_main">

                                {sourcesToDisplay.map((source: any, index: number) => (
                                    <React.Fragment key={index}>
                                        {/* <span className="me-1">
                                            {strings.sourceLabel}
                                        </span> */}
                                        {source.source}
                                        {/* Add the pipe separator only if it is not the last element */}
                                        {index < sourcesToDisplay.length - 1 && <span className="source_sep">  </span>}
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                    ) : null

            }
        </>
    )
}
