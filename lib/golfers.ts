export type Golfer = {
  id: string;
  espnId: string;
  name: string;
  salary: number;
};

// Texas Children's Houston Open field — swap for Masters field April 9
export const GOLFERS: Golfer[] = [
  { id: "koepka",       espnId: "6798",     name: "Brooks Koepka",             salary: 11500 },
  { id: "fowler",       espnId: "3702",     name: "Rickie Fowler",             salary: 11000 },
  { id: "clark",        espnId: "11119",    name: "Wyndham Clark",             salary: 10500 },
  { id: "im",           espnId: "11382",    name: "Sungjae Im",                salary: 10000 },
  { id: "lowry",        espnId: "4587",     name: "Shane Lowry",               salary: 9500  },
  { id: "burns",        espnId: "9938",     name: "Sam Burns",                 salary: 9000  },
  { id: "zalatoris",    espnId: "9877",     name: "Will Zalatoris",            salary: 8800  },
  { id: "finau",        espnId: "2230",     name: "Tony Finau",                salary: 8500  },
  { id: "theegala",     espnId: "10980",    name: "Sahith Theegala",           salary: 8000  },
  { id: "kim",          espnId: "4602673",  name: "Tom Kim",                   salary: 7800  },
  { id: "english",      espnId: "5408",     name: "Harris English",            salary: 7500  },
  { id: "mccarthy",     espnId: "10054",    name: "Denny McCarthy",            salary: 7200  },
  { id: "minwoolee",    espnId: "4410932",  name: "Min Woo Lee",               salary: 7000  },
  { id: "pendrith",     espnId: "9658",     name: "Taylor Pendrith",           salary: 6800  },
  { id: "day",          espnId: "1680",     name: "Jason Day",                 salary: 6500  },
  { id: "scott",        espnId: "388",      name: "Adam Scott",                salary: 6200  },
  { id: "glover",       espnId: "676",      name: "Lucas Glover",              salary: 6000  },
  { id: "horschel",     espnId: "1651",     name: "Billy Horschel",            salary: 5800  },
  { id: "kuchar",       espnId: "257",      name: "Matt Kuchar",               salary: 5500  },
  { id: "hoge",         espnId: "6086",     name: "Tom Hoge",                  salary: 5200  },
  { id: "bezuidenhout", espnId: "9243",     name: "Christiaan Bezuidenhout",   salary: 5000  },
  { id: "kitayama",     espnId: "10364",    name: "Kurt Kitayama",             salary: 4800  },
  { id: "mitchell",     espnId: "8906",     name: "Keith Mitchell",            salary: 4600  },
  { id: "dunlap",       espnId: "4832046",  name: "Nick Dunlap",               salary: 4400  },
  { id: "sargent",      espnId: "5139663",  name: "Gordon Sargent",            salary: 4200  },
  { id: "hughes",       espnId: "6931",     name: "Mackenzie Hughes",          salary: 4000  },
  { id: "eckroat",      espnId: "4425898",  name: "Austin Eckroat",            salary: 3800  },
  { id: "poston",       espnId: "10505",    name: "J.T. Poston",               salary: 3600  },
  { id: "power",        espnId: "6001",     name: "Seamus Power",              salary: 3400  },
  { id: "grillo",       espnId: "5882",     name: "Emiliano Grillo",           salary: 3200  },
];

export const SALARY_CAP = 50000;
export const PICK_COUNT = 6;
