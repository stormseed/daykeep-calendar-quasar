const sampleEventArray = [
  {
    id: 1,
    summary: 'Test event',
    description: 'Some extra info goes here',
    location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
    start: {
      dateTime: '2018-02-16T14:00:00',
      timeZone: 'Europe/Zurich'
    },
    end: {
      dateTime: '2018-02-16T16:30:00',
      timeZone: 'Europe/Zurich'
    },
    color: 'positive',
    attendees: [
      {
        id: 5,
        email: 'somebody@somewhere.com',
        displayName: 'John Q. Public',
        organizer: false,
        self: false,
        resource: false
      },
      {
        id: 6,
        email: 'somebody@somewhere.com',
        displayName: 'John Q. Public',
        organizer: false,
        self: false,
        resource: false
      },
      {
        id: 7,
        email: 'somebody@somewhere.com',
        displayName: 'John Q. Public',
        organizer: false,
        self: false,
        resource: false
      },
      {
        id: 31,
        email: '',
        displayName: 'South Conference Room',
        organizer: false,
        self: false,
        resource: true
      }
    ]
  },
  {
    id: 3,
    summary: 'Test event 2',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-16T17:30:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-16T18:30:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 4,
    summary: 'Test event 3',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-13T10:30:00+0500'
    },
    end: {
      dateTime: '2018-02-13T13:00:00+0500'
    }
  },
  {
    id: 5,
    summary: 'All day event',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-13'
    },
    end: {
      date: '2018-02-13'
    }
  },
  {
    id: 103,
    summary: 'All day x4',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-15'
    },
    end: {
      date: '2018-02-18'
    }
  },
  {
    id: 101,
    summary: 'All day x3',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-14'
    },
    end: {
      date: '2018-02-16'
    }
  },
  {
    id: 102,
    summary: 'All day x2',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-14'
    },
    end: {
      date: '2018-02-15'
    }
  },
  {
    id: 104,
    summary: 'All day x4 #2',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-14'
    },
    end: {
      date: '2018-02-17'
    }
  },
  {
    id: 105,
    summary: 'All day x4 #3',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-14'
    },
    end: {
      date: '2018-02-17'
    }
  },
  {
    id: 6,
    summary: 'Overlapping event',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-13T11:30:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-13T12:30:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 7,
    summary: 'Some event',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-13T06:30:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-13T07:30:00',
      timeZone: 'America/New_York'
    },
    color: 'warning',
    textColor: 'dark'
  },
  {
    id: 'test-string-id',
    summary: 'Some other event',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-13T16:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-13T17:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 201,
    summary: 'Overlap test 33 #1',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T13:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T13:50:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 202,
    summary: 'Overlap test 33 #2',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T13:30:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T14:20:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 203,
    summary: 'Overlap test 33 #3',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T14:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T14:50:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 204,
    summary: 'Overlap test 33 #4',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T14:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T14:50:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 205,
    summary: 'Overlap test 33 #5',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T14:50:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T16:30:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 206,
    summary: 'Overlap test 33 #6',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T11:30:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T13:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 207,
    summary: 'Overlap test 33 #7',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-19T15:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-19T16:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 301,
    summary: 'Overlap 33 same #1',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-20T14:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-20T14:45:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 302,
    summary: 'Overlap 33 same #2',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-20T14:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-20T15:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 303,
    summary: 'Overlap 33 same #3',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-20T14:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-20T16:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 304,
    summary: 'Overlap 33 almost same #4',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-20T16:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-20T18:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 305,
    summary: 'Overlap 33 almost same #5',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-20T18:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-20T19:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 306,
    summary: 'Overlap 33 almost same #6',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-20T16:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-20T18:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 3601,
    summary: 'Multi-day test #36-1',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-21T14:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-22T20:00:00',
      timeZone: 'America/New_York'
    }
  },
  {
    id: 3602,
    summary: 'Multi-day test #36-2',
    description: 'Some extra info goes here',
    start: {
      dateTime: '2018-02-21T16:00:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2018-02-24T11:00:00',
      timeZone: 'America/New_York'
    }
  }
]

const sampleDateAdjustments = [
  {
    ids: [4, 5, 6, 7, 'test-string-id'],
    addDays: 5
  },
  {
    ids: [1, 3],
    addDays: 2
  },
  {
    ids: [102, 103],
    addDays: 8
  },
  {
    ids: [101],
    addDays: 10
  },
  {
    ids: [104],
    addDays: 11
  },
  {
    ids: [105],
    addDays: 13
  },
  {
    ids: [201, 202, 203, 204, 205, 206, 207],
    addDays: 14
  },
  {
    ids: [301, 302, 303, 304, 305, 306],
    addDays: 7
  },
  {
    ids: [3601, 3602],
    addDays: 0
  }
]

export {
  sampleEventArray,
  sampleDateAdjustments
}
