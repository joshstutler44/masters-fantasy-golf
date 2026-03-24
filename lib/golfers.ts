export type Golfer = {
  id: string;
  name: string;
  salary: number;
};

// 2025 Masters field with fantasy salaries
export const GOLFERS: Golfer[] = [
  { id: "scheffler", name: "Scottie Scheffler", salary: 11500 },
  { id: "mcilroy", name: "Rory McIlroy", salary: 10800 },
  { id: "rahm", name: "Jon Rahm", salary: 10200 },
  { id: "koepka", name: "Brooks Koepka", salary: 9800 },
  { id: "fowler", name: "Rickie Fowler", salary: 9200 },
  { id: "thomas", name: "Justin Thomas", salary: 9000 },
  { id: "fleetwood", name: "Tommy Fleetwood", salary: 8800 },
  { id: "morikawa", name: "Collin Morikawa", salary: 8600 },
  { id: "zalatoris", name: "Will Zalatoris", salary: 8400 },
  { id: "hovland", name: "Viktor Hovland", salary: 8200 },
  { id: "niemann", name: "Joaquin Niemann", salary: 8000 },
  { id: "burns", name: "Sam Burns", salary: 7800 },
  { id: "cantlay", name: "Patrick Cantlay", salary: 7600 },
  { id: "lowry", name: "Shane Lowry", salary: 7400 },
  { id: "kim", name: "Tom Kim", salary: 7200 },
  { id: "matsuyama", name: "Hideki Matsuyama", salary: 7000 },
  { id: "schauffele", name: "Xander Schauffele", salary: 6800 },
  { id: "finau", name: "Tony Finau", salary: 6600 },
  { id: "henley", name: "Russell Henley", salary: 6400 },
  { id: "english", name: "Harris English", salary: 6200 },
  { id: "hoge", name: "Tom Hoge", salary: 6000 },
  { id: "mcnealy", name: "Maverick McNealy", salary: 5800 },
  { id: "straka", name: "Sepp Straka", salary: 5600 },
  { id: "taylor", name: "Nick Taylor", salary: 5400 },
  { id: "young", name: "Cameron Young", salary: 5200 },
  { id: "theegala", name: "Sahith Theegala", salary: 5000 },
  { id: "wu", name: "Brandon Wu", salary: 4800 },
  { id: "power", name: "Seamus Power", salary: 4600 },
  { id: "mccarthy", name: "Denny McCarthy", salary: 4400 },
  { id: "harman", name: "Brian Harman", salary: 4200 },
];

export const SALARY_CAP = 50000;
export const PICK_COUNT = 6;
