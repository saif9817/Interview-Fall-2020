import moment from 'moment';
import fetch from 'node-fetch';

export interface ILaunch {
  flight_number?: number;
  mission_name?: string;
  rocket_name?: string;
  rocket_type?: string;
  details?: string;
  launch_success?: boolean;
  error?: string;
}

export class Launches {
  url = 'https://api.spacexdata.com/v3/launches';

  /**
   * Gets the daily spaceX launches
   * @param date string with YYYY format
   */
  public async getLaunchesByYear(year: string): Promise<ILaunch[]> {
    try {
      // Get the date as a moment object
      const dateAsMoment = moment(year, 'YYYY');
      // Check that the date string is valid, and that the date is before or equal to today's date
      // moment() creates a moment with today's date
      if (!dateAsMoment.isValid() || !dateAsMoment.isSameOrBefore(moment())) {
        return [{ error: 'invalid year' }];
      }
      // Get the parsed request
      const parsed = await this.requestLaunchesByYear(year);
      // Maps and creates the return list
      return this.filterFields(parsed);
    } catch (e) {
      console.log(e);
      return [
        {
          error: `There was an error retrieving this launch`,
        },
      ];
    }
  }
  
  /** 
   * Gets the launches within the set range
   * @param date strings with format YYYY-MM-DD for start and end of range
  */
  public async getLaunchesByRange(start: string, end: string): Promise<ILaunch[]>{
    try{
      //convert the start and end to moment objects
      const startAsMoment = moment(start, 'YYYY-MM-DD');
      const endAsMoment = moment(end, 'YYYY-MM-DD');
      //check if start and end are valid, if start is less than or equal to todays date and if end is after start
      if(!startAsMoment.isValid() || !startAsMoment.isSameOrBefore(moment())){
        return [{error: 'invalid start'}];
      }
      if(!endAsMoment.isValid() || !endAsMoment.isSameOrAfter(startAsMoment)){
        return [{error: 'invalid end'}];
      }
      const parsed = await this.requestLaunchesByRange(start, end);
      return this.filterRange(parsed);
    }catch (e){
      console.log(e);
      return [
        {
          error: 'There was an error retrieving launch information for this range'
        },
      ];
    }
  }

  /**
   * Makes the api request for launches per year
   * @param year
   */
  async requestLaunchesByYear(year: string): Promise<any[]> {
    const res = await fetch(`${this.url}?launch_year=${year}`);
    return res.json();
  }

  /**
   * Makes the api request for launches within the range
   * @param start,end
   */
  async requestLaunchesByRange(start: string, end: string): Promise<any[]>{
    const res = await fetch(`${this.url}?start=${start}&end=${end}`);
    return res.json();
  }

  /**
   * Helpers
   */

  /**
   * Filters out desired fields
   * @param data
   */
  filterFields(data: any[]) {
    return data.map((p) => ({
      flight_number: p.flight_number,
      mission_name: p.mission_name,
      rocket_name: p.rocket?.rocket_name,
      rocket_type: p.rocket?.rocket_type,
      details: p.details,
      launch_success: p.launch_success,
    }));
  }

  /**
   * Filters the range, same as above but includes date
   * @param data
   */
  filterRange(data: any[]){
    return data.map((p) => ({
      flight_number: p.flight_number,
      mission_name: p.mission_name,
      rocket_name: p.rocket?.rocket_name,
      rocket_type: p.rocket?.rocket_type,
      details: p.details,
      launch_success: p.launch_success,
      launch_date_utc: p.launch_date_utc,
    }));
  }
}
