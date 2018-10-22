import * as urljoin from 'url-join';

import http, {utils} from '../../utils/http';
import {HttpClient, InternalConfiguration, List, ResponseEnvelope} from '../../utils/types';

export const liveStatistics = (
  configuration: InternalConfiguration,
  encodingId: string,
  httpClient: HttpClient
): LiveStatistics => {
  const {get} = httpClient;

  const resourceDetails = (): Promise<ResponseEnvelope<LiveStatisticsDetail>> => {
    const url = urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings', encodingId, 'live-statistics');
    return get(configuration, url);
  };

  const events = {
    list: utils.buildListCallFunction<Event>(
      httpClient,
      configuration,
      urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings', encodingId, 'live-statistics/events')
    )
  };

  const streams = {
    list: utils.buildListCallFunction<Stream>(
      httpClient,
      configuration,
      urljoin(configuration.apiBaseUrl, 'encoding/statistics/encodings', encodingId, 'live-statistics/streams')
    )
  };

  const resource = Object.assign(resourceDetails, {
    events,
    streams
  });

  return resource;
};

interface Event {
  time: string;
  details: any;
}

interface Stream {
  id: string;
  userId: string;
  orgId: string;
  createdAt: string;
  customDataCreatedAt: string;
  time: string;
  streamInfos?: any;
}

export interface Events {
  list: List<Event>;
}

export interface Streams {
  list: List<Stream>;
}

interface LiveStatisticsDetail {
  id: string;
  createdAt: string;
  encodingId: string;
  status: string;
  events: Event[];
  statistics: Stream[];
}

export interface LiveStatistics {
  (): Promise<ResponseEnvelope<LiveStatisticsDetail>>;
  events: Events;
  streams: Streams;
}

export default (configuration: InternalConfiguration, encodingId: string): LiveStatistics => {
  return liveStatistics(configuration, encodingId, http);
};
