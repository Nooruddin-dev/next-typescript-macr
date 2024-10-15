"use client"
import React from 'react'

export default function ChartLoader(props: any) {
    return (
        <div className="main_loader"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // height: height,
                position: "absolute",
                // width: width,
                color: "#ee7420",
            }}
        >
            <p
                className="chart_loader"
                style={{ width: "100%", height: "100%" }}
            ></p>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
