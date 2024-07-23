import { FlatList, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import type { ListRenderItem } from '@react-native/virtualized-lists';

type User = {
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  id: {
    name: string;
    value: string;
  };
};

export default () => {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    const run = async () => {
      const _data = await fetchData();
      setData(_data);
    };

    void run();
  }, []);

  const renderItem: ListRenderItem<User> = useCallback(({ item: { name, email } }) => {
    const { title, first, last } = name;
    return (
      <>
        <Text>
          Name: {title} {first} {last}
        </Text>
        <Text>Email: {email}</Text>
      </>
    );
  }, []);
  return (
    <View>
      <FlatList<User> data={data} renderItem={renderItem} keyExtractor={(item) => item.id.value} />
    </View>
  );
};

const fetchData = async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=10');
  return await res.json();
};

export const DATA: { results: User[] } = {
  results: [
    {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Ida',
        last: 'Kristensen',
      },
      location: {
        street: {
          number: 2949,
          name: 'Erantisvej',
        },
        city: 'Hornbæk',
        state: 'Nordjylland',
        country: 'Denmark',
        postcode: 78056,
        coordinates: {
          latitude: '-40.8235',
          longitude: '163.8050',
        },
        timezone: {
          offset: '+7:00',
          description: 'Bangkok, Hanoi, Jakarta',
        },
      },
      email: 'ida.kristensen@example.com',
      login: {
        uuid: '559d4249-cde4-4461-9f9c-8d51401af2b5',
        username: 'silverlion833',
        password: 'marble',
        salt: '24rqAef9',
        md5: '6320d32ecfe5e8e5741c2af3922f5a42',
        sha1: 'a23ef223661f78700ebd146c1933b18b87d31294',
        sha256: '5383017fe686e315e4ebe240128f2c3c168ffeba9ccb3b1fe3ba78f72dad0225',
      },
      dob: {
        date: '1962-05-25T18:38:10.820Z',
        age: 62,
      },
      registered: {
        date: '2004-02-02T11:51:23.484Z',
        age: 20,
      },
      phone: '01691638',
      cell: '40104495',
      id: {
        name: 'CPR',
        value: '250562-5730',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/women/26.jpg',
        medium: 'https://randomuser.me/api/portraits/med/women/26.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/26.jpg',
      },
      nat: 'DK',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Barry',
        last: 'Steward',
      },
      location: {
        street: {
          number: 1921,
          name: 'Locust Rd',
        },
        city: 'Busselton',
        state: 'Western Australia',
        country: 'Australia',
        postcode: 4999,
        coordinates: {
          latitude: '63.1959',
          longitude: '-2.5579',
        },
        timezone: {
          offset: '+1:00',
          description: 'Brussels, Copenhagen, Madrid, Paris',
        },
      },
      email: 'barry.steward@example.com',
      login: {
        uuid: '02077f89-b500-431d-b374-e0eb3fca9571',
        username: 'bigdog124',
        password: 'impreza',
        salt: '4Rn9WOJw',
        md5: 'a59d5df8a316f0516ac720de70ff9984',
        sha1: '2a28929cd277ba2a7aa6af237b5178f981d39a24',
        sha256: 'f7e0cab464e6237ab744947a0d81a83eebf5416f5d73e5ebca0034a6c3883abf',
      },
      dob: {
        date: '1952-10-04T23:18:08.221Z',
        age: 71,
      },
      registered: {
        date: '2007-07-01T07:28:31.663Z',
        age: 17,
      },
      phone: '01-3956-5636',
      cell: '0431-154-199',
      id: {
        name: 'TFN',
        value: '396148093',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/73.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/73.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/73.jpg',
      },
      nat: 'AU',
    },
    {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Nurdan',
        last: 'Tanrıkulu',
      },
      location: {
        street: {
          number: 1649,
          name: 'Abanoz Sk',
        },
        city: 'İzmir',
        state: 'Kastamonu',
        country: 'Turkey',
        postcode: 12236,
        coordinates: {
          latitude: '-60.1904',
          longitude: '-170.0327',
        },
        timezone: {
          offset: '+3:00',
          description: 'Baghdad, Riyadh, Moscow, St. Petersburg',
        },
      },
      email: 'nurdan.tanrikulu@example.com',
      login: {
        uuid: '24b26e9a-8a6b-4512-861f-f5f936d0e57e',
        username: 'brownpeacock362',
        password: 'playtime',
        salt: 'OleOXtTP',
        md5: 'e6db746d780e15546d056c6cfc3d0596',
        sha1: 'f91fd1d1d07d1c1e77ba5e4239d59119e02f0c72',
        sha256: '12dc899d99a3e070d624c1425ce162119972eb027629a11a3d57c4731d6f13e0',
      },
      dob: {
        date: '1981-09-06T15:04:24.958Z',
        age: 42,
      },
      registered: {
        date: '2010-11-06T07:44:26.522Z',
        age: 13,
      },
      phone: '(216)-483-4039',
      cell: '(404)-334-2627',
      id: {
        name: '',
        value: null,
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/women/94.jpg',
        medium: 'https://randomuser.me/api/portraits/med/women/94.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/94.jpg',
      },
      nat: 'TR',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Elijah',
        last: 'Ellis',
      },
      location: {
        street: {
          number: 5049,
          name: 'Edwards Rd',
        },
        city: 'Australian Capital Territory',
        state: 'Western Australia',
        country: 'Australia',
        postcode: 2678,
        coordinates: {
          latitude: '72.7709',
          longitude: '92.3434',
        },
        timezone: {
          offset: '-11:00',
          description: 'Midway Island, Samoa',
        },
      },
      email: 'elijah.ellis@example.com',
      login: {
        uuid: 'c5826670-a31a-4c5b-ab3b-4a6f42a7e470',
        username: 'brownleopard128',
        password: 'funny',
        salt: '8XFQHn3b',
        md5: 'ff79f92e8f590cd0a32b5789a440eab1',
        sha1: '6244732c4ea030b901657f2a770e3c64c1882290',
        sha256: 'ce00727610927378f84ae32738d3837b0bd326fcabf61483db473f4bb9ca8d13',
      },
      dob: {
        date: '2000-01-19T13:38:11.062Z',
        age: 24,
      },
      registered: {
        date: '2014-04-10T00:16:14.729Z',
        age: 10,
      },
      phone: '00-7157-8777',
      cell: '0418-427-029',
      id: {
        name: 'TFN',
        value: '138117486',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/53.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/53.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/53.jpg',
      },
      nat: 'AU',
    },
    {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Rianna',
        last: 'Cegelskiy',
      },
      location: {
        street: {
          number: 5024,
          name: 'Magistratska',
        },
        city: 'Gorlivka',
        state: 'Ivano-Frankivska',
        country: 'Ukraine',
        postcode: 11184,
        coordinates: {
          latitude: '-34.7506',
          longitude: '175.7042',
        },
        timezone: {
          offset: '-9:00',
          description: 'Alaska',
        },
      },
      email: 'rianna.cegelskiy@example.com',
      login: {
        uuid: '6074474a-3b03-4430-831e-dfc8b83d0538',
        username: 'purplegorilla527',
        password: 'bremen',
        salt: 'kll5ul1K',
        md5: '7c0905f85d9955c39c1dfc4fde758421',
        sha1: 'df8a154b09b6bf9d557dea54882fce505e119af1',
        sha256: '87c162f5213fb2e949cb0bb609224c053c414e6be0a46a80a9e36e8454754752',
      },
      dob: {
        date: '1977-10-09T20:29:29.511Z',
        age: 46,
      },
      registered: {
        date: '2014-06-04T21:40:50.237Z',
        age: 10,
      },
      phone: '(066) V30-8592',
      cell: '(096) C21-8101',
      id: {
        name: '',
        value: null,
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/women/68.jpg',
        medium: 'https://randomuser.me/api/portraits/med/women/68.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/68.jpg',
      },
      nat: 'UA',
    },
    {
      gender: 'male',
      name: {
        title: 'Mr',
        first: 'Miro',
        last: 'Halko',
      },
      location: {
        street: {
          number: 4891,
          name: 'Hämeenkatu',
        },
        city: 'Kiikoinen',
        state: 'North Karelia',
        country: 'Finland',
        postcode: 20659,
        coordinates: {
          latitude: '-84.3128',
          longitude: '171.3976',
        },
        timezone: {
          offset: '+2:00',
          description: 'Kaliningrad, South Africa',
        },
      },
      email: 'miro.halko@example.com',
      login: {
        uuid: '980b28ce-ccc2-4d73-b04e-35d22b7ea4ef',
        username: 'heavymeercat231',
        password: 'wingman',
        salt: '8syuBg1y',
        md5: 'ae1cf1e11ab4e70f1a02843b14d85093',
        sha1: 'f0f10deae6af9e31abbcd090afdd040174a8d1fa',
        sha256: '8e672cfc3a8fde8af41dd48a00d55100630f1d350d7be4546b370e2706050207',
      },
      dob: {
        date: '1960-07-13T10:52:34.013Z',
        age: 64,
      },
      registered: {
        date: '2013-07-04T21:31:46.009Z',
        age: 11,
      },
      phone: '03-397-597',
      cell: '045-053-53-68',
      id: {
        name: 'HETU',
        value: 'NaNNA945undefined',
      },
      picture: {
        large: 'https://randomuser.me/api/portraits/men/17.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/17.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/17.jpg',
      },
      nat: 'FI',
    },
  ],
};
