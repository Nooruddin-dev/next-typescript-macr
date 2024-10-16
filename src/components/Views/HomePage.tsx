import React from 'react'
import LayoutMain from '../Layouts/LayoutMain'
import Header from '../Layouts/Home/Header'
import CategorySection from '../home/CategorySection'

export default function HomePage() {
    return (
        <>
            <LayoutMain

            >
                <Header
                    hideCategoryNav={true}
                />

                {/* <h2>hello</h2> */}

                <CategorySection  />

                {/* <div>hello hello. home page</div> */}
            </LayoutMain>
        </>
    )
}
