import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useTracker } from 'meteor/react-meteor-data';
import { EventsAppDateItem } from './EventsAppDateItem.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faMapMarker} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Events } from '../api/events';
library.add(faCaretLeft, faCaretRight, faMapMarker);

export const EventsApp = () => {
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));

    const monthYear = moment(selectedDate).format("MMMM YYYY");

    const daysOfWeek = generateWeekDays(selectedDate);

    const handleLeftCaretClick = () => {
      setSelectedDate(moment(selectedDate).subtract(7, 'days').format("YYYY-MM-DD"));
    };

    const handleRightCaretClick = () => {
      setSelectedDate(moment(selectedDate).add(7, 'days').format("YYYY-MM-DD"));
    };

    const subscriptionReady = useTracker(() => {
      const today = moment(selectedDate);
      const dayOfWeek = today.day();
      today.subtract((dayOfWeek + 7), "days");
      let beginDate = today.format();
      today.add(22, "days");
      let endDate = today.format();
      const handle = Meteor.subscribe('events', beginDate, endDate);  // replace someStartDate and someEndDate with your logic
      return handle.ready();
    });

    const allEvents = Events.find().fetch();
    console.log("allEvents");
    console.log(allEvents);

    const hasEventsForDay = (day) => {
      return allEvents.some(event => {
        const eventStartDay = moment(event.start).startOf('day');
        return eventStartDay.isSame(day.startOf('day'));
      });
    };

    const testEvents = useTracker(() => {
        const selectedMoment = moment(selectedDate);
        const rangeBegin = selectedMoment.format();
        selectedMoment.add(1, "days");
        const rangeEnd = selectedMoment.format();

        const rawEvents = Events.find({
            start: {
                $gte: rangeBegin,
                $lt: rangeEnd
            }
        }).fetch();

        return rawEvents.sort((a,b) => a.start.localeCompare(b.start))
        .map(obj => {
            let location = "";
            if(obj.type === "Community Event (Out of School)") {
                location = "Out of School";
            } else if (obj.type === "Community Event (In School)") {
                location = "In School";
            }
            const startAndEndTime = moment(obj.start).format("h:mm A") + " to " + moment(obj.end).format("h:mm A");
            const formattedTime = startAndEndTime === "12:00 AM to 12:00 AM" ? "All Day" : startAndEndTime;
            const startTime = moment(obj.start).format("h:mm A") + " (ET)";
            const displayTime = startTime === "12:00 AM (ET)" ? "" : startTime;

            return {
                bigName: obj.title || obj.type,
                startTime: displayTime,
                startAndEndTime: formattedTime,
                location: location
            };
        });
    });

    return (
        <div style={{ textAlign: "center", margin: "0 auto", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", margin: "0 auto", maxWidth: "500px" }}>
        {/* Header */}
        <div style={{ background: "#002653", color: "white", padding: "10px" }}>
            <h3> Pierrepont Schedule </h3>
        </div>
        {/* Dates */}
        <div style={{ background: "#f2f3f7" }}>
            <div style={{ textAlign: "center", fontSize: "0.8em" }}>
                {moment(selectedDate).format("MMMM YYYY")}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8em", paddingRight: "20px", paddingLeft: "20px" }}>
                {/* Left Caret */}
                <div className="car" id="leftCaret" style={{ display: "flex", alignItems: "center", fontSize: "2em" }} onClick={handleLeftCaretClick}>
                  <FontAwesomeIcon icon="caret-left" />
                </div>

                {daysOfWeek.map(day => (
                  <EventsAppDateItem
                  key={day.format("YYYY-MM-DD")}
                  dayAbbreviation={day.format("ddd")}
                  dayNum={day.format("D")}
                  visibilityStr={hasEventsForDay(day)}
                  selected={day.isSame(moment(selectedDate), "day")}
                  onClick={() => setSelectedDate(day.format("YYYY-MM-DD"))}
                  />
                ))}
                {/* Right Caret */}
                <div className="car" id="rightCaret" style={{ display: "flex", alignItems: "center", fontSize: "2em" }} onClick={handleRightCaretClick}>
                  <FontAwesomeIcon icon="caret-right" />
                </div>

            </div>
        </div>
        {/* Events */}
        <div>
        {testEvents.map(event => (
          <React.Fragment key={event.bigName}>
          <div style={{ background: "#d6e7f7", textAlign: "left", paddingLeft: "30px", paddingTop: "5px", paddingBottom: "5px", fontSize: "0.6em", fontWeight: "bold" }}>
          {event.startTime}
          </div>
          <div style={{ background: "#f2f3f7", display: "flex" }}>
          <div style={{ background: "#eeeff3", flex: "0 0 100px", padding: "10px" }}>
          {event.startAndEndTime}
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "1.5em", textAlign: "left" }}>
          {event.bigName}
          </div>
          <div style={{ fontSize: "0.8em", textAlign: "left" }}>
          {event.location && <FontAwesomeIcon icon={faMapMarker} />}
          <span style={{ padding: "5px" }}>
          {event.location}
          </span>
          </div>
          </div>
          </div>
          </React.Fragment>
        ))}
        </div>
    </div>
        </div>
    );
};



const generateWeekDays = (selectedDate) => {
    const startOfWeek = moment(selectedDate).startOf('week');
    const endOfWeek = moment(selectedDate).endOf('week');
    const days = [];

    let currentDay = startOfWeek;

    while (currentDay <= endOfWeek) {
        days.push(currentDay.clone()); // Use clone to avoid mutating the original object
        currentDay.add(1, 'day');
    }

    return days;
};
