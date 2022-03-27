export interface IStormGlassPointSource {
  [key: string]: number;
}

export interface IStormGlassPoint {
  readonly time: string;
  readonly waveHeight: IStormGlassPointSource;
  readonly waveDirection: IStormGlassPointSource;
  readonly swellHeight: IStormGlassPointSource;
  readonly swellDirection: IStormGlassPointSource;
  readonly swellPeriod: IStormGlassPointSource;
  readonly windDirection: IStormGlassPointSource;
  readonly windSpeed: IStormGlassPointSource;
}

export interface IStormGlassForecastResponse {
  hours: IStormGlassPoint[];
}
