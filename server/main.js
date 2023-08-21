import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Events } from '/imports/api/events';
import moment from "moment";

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

async function insertEvent(doc) {
  doc.createdAt = doc.createdAt || moment().format();
  await Events.insertAsync(doc);
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  const eventsDefaultData = [
  {
    "_id": "a4dc6tkygpk089wtrs4ou0b",
    "title": "SAT",
    "start": "2023-08-26T07:30:00-04:00",
    "end": "2023-08-26T15:00:00-04:00",
    "type": "Community Event (In School)",
    "owner": "abTpGYxdQBZ4Yx7hk",
    "createdBy": "abTpGYxdQBZ4Yx7hk",
    "createdAt": "2023-06-19T19:40:34+00:00"
  },
  {
    "_id": "c2ergxmg56q2ukk3a31vbr",
    "title": "Student Open House and New Parent Orientation",
    "start": "2023-09-05T00:00:00-04:00",
    "end": "2023-09-06T00:00:00-04:00",
    "type": "Community Event (In School)",
    "owner": "oBRzxyRkMwwoBczgE",
    "createdBy": "oBRzxyRkMwwoBczgE",
    "createdAt": "2023-06-09T20:10:29+00:00"
  },
  {
    "_id": "ivp67liui7qvbiq1y3tv48",
    "title": "First Full Day of the School Year!",
    "start": "2023-09-06T00:00:00-04:00",
    "end": "2023-09-07T00:00:00-04:00",
    "type": "Community Event (In School)",
    "owner": "oBRzxyRkMwwoBczgE",
    "createdBy": "oBRzxyRkMwwoBczgE",
    "createdAt": "2023-07-03T16:17:28+00:00"
  },
  {
    "_id": "fx4bqn3oow98rmpi8asu55",
    "title": "High School Cereal Bar",
    "start": "2023-09-22T00:00:00-04:00",
    "end": "2023-09-23T00:00:00-04:00",
    "type": "Community Event (In School)",
    "owner": "oBRzxyRkMwwoBczgE",
    "createdBy": "oBRzxyRkMwwoBczgE",
    "createdAt": "2023-08-07T17:16:52+00:00"
  },
  {
    "_id": "7s947ktgcqn25wds1mv008",
    "title": "Amherst College Visit",
    "start": "2023-09-28T10:00:00-04:00",
    "end": "2023-09-28T11:00:00-04:00",
    "type": "Community Event (In School)",
    "owner": "abTpGYxdQBZ4Yx7hk",
    "createdBy": "abTpGYxdQBZ4Yx7hk",
    "createdAt": "2023-08-07T19:50:57+00:00"
  },
  {
    "_id": "5du6j94hfyd4slrnzoxm6t",
    "title": "All Parent Orientation at Branson Hall",
    "start": "2023-09-07T19:00:00-04:00",
    "end": "2023-09-07T20:30:00-04:00",
    "type": "Community Event (Out of School)",
    "owner": "oBRzxyRkMwwoBczgE",
    "createdBy": "oBRzxyRkMwwoBczgE",
    "createdAt": "2023-07-03T16:18:11+00:00"
  },
  {
    "_id": "aejczex4fgjxhsmqjo9kl",
    "title": "Yom Kippur School Closed",
    "start": "2023-09-25T00:00:00-04:00",
    "end": "2023-09-26T00:00:00-04:00",
    "type": "Holiday",
    "owner": "gQvWiyYrYwbpckJGr",
    "createdBy": "gQvWiyYrYwbpckJGr",
    "createdAt": "2023-02-18T03:38:29+00:00"
  },
  {
    "_id": "rz6hoyklrzgvn1bocrndu",
    "title": "Indigenous People's Day School Closed",
    "start": "2023-10-09T00:00:00-04:00",
    "end": "2023-10-10T00:00:00-04:00",
    "type": "Holiday",
    "owner": "gQvWiyYrYwbpckJGr",
    "createdBy": "gQvWiyYrYwbpckJGr",
    "createdAt": "2023-02-18T03:39:07+00:00"
  },
  {
    "_id": "ubfxoaw5hug3oqvthz8gv",
    "title": "Haunted House Outing",
    "start": "2023-10-27T00:00:00-04:00",
    "end": "2023-10-28T00:00:00-04:00",
    "type": "Community Event (Out of School)",
    "owner": "oBRzxyRkMwwoBczgE",
    "createdBy": "oBRzxyRkMwwoBczgE",
    "createdAt": "2023-08-07T17:27:41+00:00"
  },
  {
    "_id": "dqalg1vwrjvoa56hx1ebe",
    "title": "HS Reports Due",
    "start": "2023-10-19T00:00:00-04:00",
    "end": "2023-10-20T00:00:00-04:00",
    "type": "Due Date",
    "owner": "gQvWiyYrYwbpckJGr",
    "createdBy": "gQvWiyYrYwbpckJGr",
    "createdAt": "2023-02-18T03:58:27+00:00"
  },
  {
    "_id": "n2hwnh4z4eje2mascq73b",
    "title": "LS & MS Reports Due",
    "start": "2023-10-23T00:00:00-04:00",
    "end": "2023-10-24T00:00:00-04:00",
    "type": "Due Date",
    "owner": "gQvWiyYrYwbpckJGr",
    "createdBy": "gQvWiyYrYwbpckJGr",
    "createdAt": "2023-02-18T03:57:48+00:00"
  }
]

  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  if (await Events.find().countAsync() === 0) {
    for (const doc of eventsDefaultData) {
      await insertEvent(doc);
    }
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });

  Meteor.publish("events", function (start, end) {
    const types = ['Holiday', 'Parent Teacher Conference', 'Community Event (In School)', 'Community Event (Out of School)', 'Rehearsal', 'Test']
    const query = {
      type: {$in: types},
      trashed: {$exists: false}
    };
    if(start) {
      query.start = {$gte: start};
    }
    if(end) {
      query.start = query.start || {};
      query.start.$lt = end;
    }
    return Events.find(query, {fields: {type: 1, title: 1, start: 1, end: 1, location: 1}});
  });
});
