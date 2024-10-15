import React from 'react'

export default function MacroInfoIcon(
    {
        infoName,
        allowLeftTooltip,
        infoIconToCenter,
        otherClasses
    }: any
) {
    return (
        <i data-tooltip-id={infoName} className={`textComment_icon ${allowLeftTooltip == true ? 'allow-left-tooltip' : ''} ${infoIconToCenter == true ? 'allow-center-tooltip' : ''} ${otherClasses}`} >
            <div className="tooltiptext">{infoName}</div>
        </i>
    )
}
