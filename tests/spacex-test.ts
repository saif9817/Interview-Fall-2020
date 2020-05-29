import {} from 'jasmine';
import { Launches, ILaunch } from '../src/spaceX/launches';

describe('daily_launch_tests', () => {
  it('test filtering fields', async () => {
    const res = [
      {
        flight_number: 1,
        mission_name: 'Mission 1',
        rocket: {
          rocket_name: 'Rocket 1',
          rocket_type: 'Rocket Type 1',
        },
        details: 'space is cool man',
        launch_success: true,
        extraField1: 1,
        extraField2: 2,
        extraField3: 3,
      },
    ];
    const expected = [
      {
        flight_number: 1,
        mission_name: 'Mission 1',
        rocket_name: 'Rocket 1',
        rocket_type: 'Rocket Type 1',
        details: 'space is cool man',
        launch_success: true,
      },
    ];
    const launches = new Launches();
    expect(launches.filterFields(res)).toEqual(expected);
  });

  it('test with invalid date', async () => {
    const launches = new Launches();
    const result = await launches.getLaunchesByYear('jaslkdjalskjdalksdj');
    expect(result).toEqual([
      {
        error: `invalid year`,
      },
    ]);
  });

  it('test with mock call', async () => {
    const res = [
      {
        flight_number: 1,
        mission_name: 'Mission 1',
        rocket: {
          rocket_name: 'Rocket 1',
          rocket_type: 'Rocket Type 1',
        },
        details: 'space is cool man',
        launch_success: true,
      },
    ];
    const expected = [
      {
        flight_number: 1,
        mission_name: 'Mission 1',
        rocket_name: 'Rocket 1',
        rocket_type: 'Rocket Type 1',
        details: 'space is cool man',
        launch_success: true,
      },
    ];
    const launches = new Launches();
    spyOn(launches, 'requestLaunchesByYear').and.returnValue(
      Promise.resolve(res)
    );
    const result = await launches.getLaunchesByYear('2020');
    expect(result).toEqual(expected);
  });

    it('actually make api call, check required fields', async () => {
      const launches = new Launches();
      const result = await launches.getLaunchesByYear('2020');
      expect(!!(result.length
          && result[0].flight_number
          && result[0].mission_name
          && result[0].rocket_name
          && result[0].rocket_type
          )).toBe(true);
    });
});

describe('range tests', ()  => {
  it('test filtering range', async () => {
    const res = [
      {
        flight_number: 1,
        mission_name: 'Mission 1',
        rocket: {
          rocket_name: 'Rocket 1',
          rocket_type: 'Rocket Type 1',
        },
        details: 'space is cool man',
        launch_success: true,
        launch_date_utc: "2006-03-24T22:30:00.000Z",
        extraField1: 1,
        extraField2: 2,
        extraField3: 'daslfkasflasfop',
      },
    ];
    const expected = [
    {
      flight_number: 1,
      mission_name: 'Mission 1',
      rocket_name: 'Rocket 1',
      rocket_type: 'Rocket Type 1',
      details: 'space is cool man',
      launch_success: true,
      launch_date_utc: "2006-03-24T22:30:00.000Z",
      },
    ];
  });
  it('test with invalid start', async () => {
    const launches = new Launches();
    const result = await launches.getLaunchesByRange('2023-04-02', '2024-02-04');
    expect(result).toEqual([
      {
        error: `invalid start`,
      },
    ]);
  });

  it('test with invalid end', async () => {
    const launches = new Launches();
    const result = await launches.getLaunchesByRange('2008-04-02', '2005-02-03');
    expect(result).toEqual([
      {
        error: `invalid end`,
      },
    ]);
  });

});
