import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HouresFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalizedWeather3HouresFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lon = 151.289824;

    axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HouresFixture);

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.FetchPoints(lat, lon);

    expect(response).toEqual(stormGlassNormalizedWeather3HouresFixture);
  });
});
