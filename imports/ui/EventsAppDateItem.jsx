import React from 'react';

export const EventsAppDateItem = ({ dayAbbreviation, dayNum, selected, visibilityStr, onClick }) => (
    <div style={{ textAlign: "center", position: "relative" }} className="dateItem" onClick={onClick}>
        <div>{dayAbbreviation}</div>
        <div style={{ fontSize: "2em", ...(selected ? { position: "relative", zIndex: 1, color: "white" } : {}) }}>
            {dayNum}
        </div>
        {selected &&
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "3em", height: "3em", borderRadius: "50%", background: "#005ac0" }}></div>
        }
        <div style={visibilityStr ? {} : { visibility: "hidden" }}>•</div>
    </div>
);

const handleClick = () => {
    Session.set("selectedDate", dayData.dateStr);
};
