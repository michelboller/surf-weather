import { ClientRequestError } from '@src/util/errors/client-request-error';
import { StormGlassResponseError } from '@src/util/errors/stormGlass-response-error';
import { IForecastPoint } from '@src/util/interfaces/forecast-point';
import { AxiosStatic, AxiosError } from 'axios';
import config, { IConfig } from 'config';
import {
  IStormGlassForecastResponse,
  IStormGlassPoint,
} from '@src/util/interfaces/stormGlass-forecast-response';

const stormGlassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  constructor(protected request: AxiosStatic) {}

  public async FetchPoints(
    lat: number,
    lng: number
  ): Promise<IForecastPoint[]> {
    try {
      const response = await this.request.get<IStormGlassForecastResponse>(
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${
          this.stormGlassAPIParams
        }&source=${
          this.stormGlassAPIParams
        }&end=1592113802&lat=${lat}&lng=${lng}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get('apiToken'),
          },
        }
      );
      return this.normalizeResponse(response.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      const error = err as Error;

      if (axiosErr.response && axiosErr.response.status) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(axiosErr.response.data)} Code: ${
            axiosErr.response.status
          }`
        );
      }
      throw new ClientRequestError(error.message);
    }
  }

  private normalizeResponse(
    points: IStormGlassForecastResponse
  ): IForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windDirection[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<IStormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
