// Verified facts for each machine. Fun first-person "letter" text is kept separate in `letter`.
// Text may use [[glossaryKey|shown words]] to add a tap/hover definition.
import apolloLm from "@/assets/apollo-lm.jpg";
import lunarRover from "@/assets/lunar-rover.jpg";
import marsRover from "@/assets/mars-rover.jpg";
import insightImg from "@/assets/insight.jpg";
import ingenuityImg from "@/assets/ingenuity.jpg";
import voyagerImg from "@/assets/voyager.jpg";
import pioneerImg from "@/assets/pioneer.jpg";

export type Zone = "moon" | "mars" | "deep";
export type Status = "talking" | "traveling" | "resting" | "complete";

export const statusLabels: Record<Status, string> = {
  talking: "Still talking",
  traveling: "Silent but traveling",
  resting: "Resting on the surface",
  complete: "Mission complete",
};

export const zoneLabels: Record<Zone, string> = { moon: "The Moon", mars: "Mars", deep: "Deep Space" };

export interface QuizQuestion { q: string; options: string[]; answer: number; explain: string }
export interface TimelineEvent { date: string; label: string; kind: "launch" | "landing" | "end" | "milestone" }

export interface Hardware {
  slug: string;
  name: string;
  zone: Zone;
  status: Status;
  image: string;
  imageAlt: string;
  launch: string;
  location: string;
  letter: string;
  mission: string;
  discoveries: string[];
  ending: string;
  mattersToday: string;
  thinkAbout: string;
  legacy: string;
  quiz: QuizQuestion[];
  map: { x: number; y: number };
  events: TimelineEvent[];
  source: { label: string; url: string };
}

export const hardware: Hardware[] = [
  {
    slug: "apollo-11-eagle",
    name: "Apollo 11 Lunar Module 'Eagle' (descent stage)",
    zone: "moon",
    status: "resting",
    image: apolloLm,
    imageAlt: "Illustration of the gold Apollo lunar module descent stage on the grey Moon",
    launch: "July 16, 1969",
    location: "Sea of Tranquility, the Moon",
    letter: "Hi, I'm Eagle's bottom half. On July 20, 1969, I carried two people to the Moon for the very first time. When they left, I stayed behind and became their launch pad. I've been standing here ever since.",
    mission: "Land astronauts Neil Armstrong and Buzz Aldrin safely on the Moon, then act as a launch pad so the top half could fly them back up.",
    discoveries: [
      "Astronauts collected about 21.5 kg of Moon rocks and [[regolith|dust]] for scientists on Earth.",
      "The rocks showed the Moon is about 4.5 billion years old.",
      "They set up experiments, including a [[seismometer|seismometer]] and a [[retroreflector|retroreflector]].",
    ],
    ending: "The [[descent|descent stage]] was always meant to stay. When the top half blasted off on July 21, 1969, it was left on the surface for good.",
    mattersToday: "NASA's Artemis program plans to return astronauts to the Moon. Lessons from Apollo landings help engineers design new landers.",
    thinkAbout: "The descent stage has a plaque that says 'We came in peace for all mankind.' What message would you leave on the Moon?",
    legacy: "Plaque on its leg: \"Here men from the planet Earth first set foot upon the Moon, July 1969, A.D. We came in peace for all mankind.\"",
    quiz: [
      { q: "What job did the descent stage do after landing?", options: ["It drove around", "It became a launch pad", "It flew back to Earth"], answer: 1, explain: "The top half used it as a launch pad to fly back up." },
      { q: "Who were the first two people on the Moon?", options: ["Armstrong and Aldrin", "Lovell and Swigert", "Glenn and Shepard"], answer: 0, explain: "Neil Armstrong and Buzz Aldrin walked on the Moon on July 20, 1969." },
    ],
    map: { x: 30, y: 40 },
    events: [
      { date: "1969-07-16", label: "Apollo 11 launches", kind: "launch" },
      { date: "1969-07-20", label: "Eagle lands on the Moon", kind: "landing" },
    ],
    source: { label: "NASA: Apollo 11 Mission Overview", url: "https://www.nasa.gov/mission/apollo-11/" },
  },
  {
    slug: "lunar-roving-vehicle",
    name: "Lunar Roving Vehicle",
    zone: "moon",
    status: "resting",
    image: lunarRover,
    imageAlt: "Illustration of the Apollo moon buggy with mesh wheels and umbrella antenna",
    launch: "July 26, 1971 (first one, on Apollo 15)",
    location: "Three rovers: Hadley-Apennine, Descartes Highlands, and Taurus-Littrow on the Moon",
    letter: "Vroom! I'm a moon buggy. My wheels are made of woven wire, because rubber tires would not work in the cold, airless Moon. Three of us are still parked up here, right where the astronauts left us.",
    mission: "Let astronauts on Apollo 15, 16, and 17 drive much farther from their lander, so they could explore more and collect more rocks.",
    discoveries: [
      "Astronauts could travel many kilometers from the lander, reaching mountains and crater rims.",
      "On Apollo 15, astronauts found the 'Genesis Rock,' a very old piece of the Moon's early crust.",
      "A camera on the rover filmed the lunar module taking off on Apollo 16 and 17.",
    ],
    ending: "Each rover was left behind when its crew went home. Bringing them back would have been too heavy.",
    mattersToday: "NASA is working on new crewed Moon rovers for Artemis astronauts to explore the Moon's south pole.",
    thinkAbout: "Why do you think the rover had wire-mesh wheels instead of air-filled rubber tires?",
    legacy: "Its last job on Apollo 17 (December 1972): filming the lander's liftoff so people on Earth could watch.",
    quiz: [
      { q: "How many moon buggies are still on the Moon?", options: ["One", "Three", "Ten"], answer: 1, explain: "Apollo 15, 16 and 17 each left one rover." },
      { q: "What were the rover's wheels made of?", options: ["Rubber", "Wood", "Woven wire mesh"], answer: 2, explain: "Woven wire works in extreme cold and with no air." },
    ],
    map: { x: 62, y: 30 },
    events: [
      { date: "1971-07-30", label: "First moon buggy drives on the Moon (Apollo 15)", kind: "milestone" },
      { date: "1972-12-14", label: "Last Apollo crew leaves the Moon (Apollo 17)", kind: "end" },
    ],
    source: { label: "NASA: The Lunar Roving Vehicle", url: "https://www.nasa.gov/history/45-years-ago-apollo-15-astronauts-explore-the-moon-with-a-lunar-rover/" },
  },
  {
    slug: "apollo-retroreflectors",
    name: "Apollo Laser Retroreflectors",
    zone: "moon",
    status: "talking",
    image: apolloLm,
    imageAlt: "Illustration of the Apollo landing site where retroreflectors were placed",
    launch: "1969 to 1971 (Apollo 11, 14 and 15)",
    location: "Three Apollo landing sites on the Moon",
    letter: "I don't have a voice, but I still answer every day! Scientists on Earth shine a laser at me, and I bounce the light straight back. That tells them exactly how far away the Moon is.",
    mission: "Help scientists measure the exact distance between Earth and the Moon.",
    discoveries: [
      "By timing a [[laser|laser]] beam's round trip, scientists measure the Earth-Moon distance very precisely.",
      "They found the Moon is slowly moving away from Earth, about 3.8 cm each year. That's about as fast as your fingernails grow!",
      "The data helps test ideas about gravity, including Einstein's theory.",
    ],
    ending: "It hasn't ended! The [[retroreflector|retroreflectors]] need no power, so observatories still use them.",
    mattersToday: "New, improved retroreflectors are planned for future Moon missions to make even better measurements.",
    thinkAbout: "If the Moon moves away 3.8 cm a year, how much farther will it be when you are 100 years old?",
    legacy: "Still bouncing laser light back to Earth more than 50 years after it was placed.",
    quiz: [
      { q: "What do scientists shine at the retroreflectors?", options: ["A flashlight", "A laser", "Radio music"], answer: 1, explain: "A laser beam is aimed at them and its return is timed." },
      { q: "What did we learn about the Moon?", options: ["It's moving away slowly", "It's getting closer", "It's made of cheese"], answer: 0, explain: "About 3.8 cm farther each year." },
    ],
    map: { x: 45, y: 65 },
    events: [{ date: "1971-07-31", label: "Apollo 15 places the largest retroreflector", kind: "milestone" }],
    source: { label: "NASA: Apollo-era experiment still returning data", url: "https://science.nasa.gov/moon/" },
  },
  {
    slug: "surveyor-3",
    name: "Surveyor 3",
    zone: "moon",
    status: "complete",
    image: apolloLm,
    imageAlt: "Illustration of a Moon landing site",
    launch: "April 17, 1967",
    location: "Ocean of Storms, the Moon",
    letter: "I landed on the Moon before any human did. Two years later, I got visitors! Apollo 12 astronauts walked over, said hello, and took my camera home with them.",
    mission: "Test whether the Moon's ground was firm enough for a crewed landing, and dig into the soil.",
    discoveries: [
      "Its little scoop dug trenches and showed the ground could hold up a spacecraft.",
      "It took thousands of photos of the surface.",
      "Apollo 12 astronauts brought back its camera in November 1969 so scientists could study how parts age on the Moon.",
    ],
    ending: "Surveyor 3 stopped working on May 4, 1967, when the long, freezing lunar night set in.",
    mattersToday: "Studying parts that sit on the Moon for years helps engineers build hardware that lasts for Artemis bases.",
    thinkAbout: "Why would scientists want to bring back a piece of an old spacecraft instead of leaving it?",
    legacy: "The only robot on the Moon that astronauts later visited in person (Apollo 12, 1969).",
    quiz: [
      { q: "Who visited Surveyor 3?", options: ["Apollo 12 astronauts", "A Mars rover", "No one"], answer: 0, explain: "Apollo 12 landed close by in 1969." },
      { q: "What was it testing?", options: ["If the ground was firm enough to land", "If there was air", "If it could fly"], answer: 0, explain: "It checked the soil before people landed." },
    ],
    map: { x: 75, y: 62 },
    events: [
      { date: "1967-04-17", label: "Surveyor 3 launches", kind: "launch" },
      { date: "1967-04-20", label: "Surveyor 3 lands on the Moon", kind: "landing" },
      { date: "1967-05-04", label: "Surveyor 3 goes silent", kind: "end" },
    ],
    source: { label: "NASA Science: Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/" },
  },
  {
    slug: "sojourner",
    name: "Sojourner (Mars Pathfinder)",
    zone: "mars",
    status: "complete",
    image: marsRover,
    imageAlt: "Illustration of a small solar-powered rover on red Mars",
    launch: "December 4, 1996",
    location: "Ares Vallis, Mars",
    letter: "I'm tiny, about the size of a microwave oven, but I made history. On July 4, 1997, I became the very first rover on another planet. I was supposed to work for a week. I kept going for almost three months!",
    mission: "Prove that a small [[rover|rover]] could drive on Mars and study its rocks.",
    discoveries: [
      "Studied rocks and soil near the [[lander|lander]] and measured what they were made of.",
      "Rounded pebbles hinted that water once flowed in the area long ago.",
      "Showed that cheaper, faster Mars missions were possible.",
    ],
    ending: "Sojourner talked to Earth through its lander. The last contact with Pathfinder was on September 27, 1997.",
    mattersToday: "Every Mars rover since, including Perseverance, builds on what Sojourner proved.",
    thinkAbout: "Sojourner moved very slowly, about 1 cm per second. Why might going slowly be smart on Mars?",
    legacy: "First wheels to roll across another planet.",
    quiz: [
      { q: "What was special about Sojourner?", options: ["First rover on Mars", "First helicopter", "Biggest rover"], answer: 0, explain: "It landed on July 4, 1997." },
      { q: "How long was it planned to work?", options: ["About a week", "Ten years", "One hour"], answer: 0, explain: "It lasted nearly three months instead." },
    ],
    map: { x: 25, y: 35 },
    events: [
      { date: "1996-12-04", label: "Mars Pathfinder launches", kind: "launch" },
      { date: "1997-07-04", label: "Pathfinder and Sojourner land on Mars", kind: "landing" },
      { date: "1997-09-27", label: "Last contact with Pathfinder", kind: "end" },
    ],
    source: { label: "NASA Science: Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/" },
  },
  {
    slug: "spirit",
    name: "Spirit Rover",
    zone: "mars",
    status: "complete",
    image: marsRover,
    imageAlt: "Illustration of a six-wheeled Mars rover with blue solar panels",
    launch: "June 10, 2003",
    location: "Gusev Crater, Mars",
    letter: "I'm Opportunity's twin. One of my wheels broke, so I learned to drive backwards, dragging it. That broken wheel scraped up bright white soil, and that turned out to be one of my biggest discoveries!",
    mission: "Search for clues that water once shaped Mars.",
    discoveries: [
      "Found rocks changed by water.",
      "Its stuck wheel dug up almost pure silica, a sign of ancient hot springs or steam vents, places where life could live on Earth.",
      "Watched dust devils swirl across Mars.",
    ],
    ending: "In 2009 Spirit got stuck in soft sand. It could not tilt its [[solar|solar panels]] toward the Sun for winter. It last talked to Earth on March 22, 2010, and NASA ended the mission in May 2011.",
    mattersToday: "Spirit's hot-spring clue helps scientists choose where to search for signs of ancient life.",
    thinkAbout: "A broken wheel led to a big discovery. Can you think of a time a mistake taught you something?",
    legacy: "Last signal: March 22, 2010. Planned for 90 [[sol|sols]], it worked for over six years.",
    quiz: [
      { q: "What did Spirit's broken wheel uncover?", options: ["Gold", "Silica, a hot-spring clue", "Ice cream"], answer: 1, explain: "Silica forms around hot water." },
      { q: "Why did Spirit stop?", options: ["It got stuck and couldn't get enough sunlight", "It ran out of fuel", "It was taken home"], answer: 0, explain: "Stuck in sand, its panels couldn't face the winter Sun." },
    ],
    map: { x: 55, y: 25 },
    events: [
      { date: "2003-06-10", label: "Spirit launches", kind: "launch" },
      { date: "2004-01-04", label: "Spirit lands on Mars", kind: "landing" },
      { date: "2010-03-22", label: "Spirit's last message", kind: "end" },
    ],
    source: { label: "NASA Science: Spirit", url: "https://science.nasa.gov/mission/mer-spirit/" },
  },
  {
    slug: "opportunity",
    name: "Opportunity Rover",
    zone: "mars",
    status: "complete",
    image: marsRover,
    imageAlt: "Illustration of the Opportunity rover on a red Martian plain",
    launch: "July 7, 2003",
    location: "Meridiani Planum, Mars",
    letter: "Hi, I'm Opportunity. I was built to last 90 days. I lasted 15 years. I drove more than a marathon on Mars! Then a giant dust storm covered the sky, and my batteries ran out.",
    mission: "Find out if Mars was ever wet.",
    discoveries: [
      "Found tiny round balls of [[hematite|hematite]], nicknamed 'blueberries.' They form in water.",
      "Found layered rocks that showed Mars once had salty, acidic water.",
      "Drove 45.16 km, more than a marathon, a record for driving on another world at the time.",
    ],
    ending: "In June 2018 a planet-wide dust storm blocked the Sun. Opportunity's [[solar|solar panels]] couldn't make power. NASA tried over 1,000 times to call it, then ended the mission on February 13, 2019.",
    mattersToday: "Opportunity's clues about water helped NASA plan Perseverance, which collects rock samples for Mars Sample Return.",
    thinkAbout: "If you were a rover, what would you want your last message to be?",
    legacy: "Last data sent: June 10, 2018. A NASA scientist described it as: 'My battery is low and it's getting dark.'",
    quiz: [
      { q: "How long was Opportunity built to last?", options: ["90 days", "15 years", "1 day"], answer: 0, explain: "90 days planned, about 15 years real." },
      { q: "What are 'blueberries' on Mars?", options: ["Fruit", "Little balls of hematite that form in water", "Tiny aliens"], answer: 1, explain: "They're a clue that water was there." },
    ],
    map: { x: 72, y: 55 },
    events: [
      { date: "2003-07-07", label: "Opportunity launches", kind: "launch" },
      { date: "2004-01-25", label: "Opportunity lands on Mars", kind: "landing" },
      { date: "2018-06-10", label: "Opportunity's last message", kind: "end" },
    ],
    source: { label: "NASA Science: Opportunity", url: "https://science.nasa.gov/mission/mer-opportunity/" },
  },
  {
    slug: "insight",
    name: "InSight Lander",
    zone: "mars",
    status: "complete",
    image: insightImg,
    imageAlt: "Illustration of the InSight lander with round solar panels and a dome seismometer",
    launch: "May 5, 2018",
    location: "Elysium Planitia, Mars",
    letter: "I'm a listener. I put a super-sensitive ear on the ground and felt Mars shake more than 1,300 times. Those quakes let me peek deep inside the planet.",
    mission: "Study the inside of Mars: its crust, mantle and core.",
    discoveries: [
      "Its [[seismometer|seismometer]] detected 1,319 [[marsquake|marsquakes]].",
      "Measured the size of Mars's liquid metal [[core|core]].",
      "Showed the crust has layers, and felt meteorite impacts hit the ground.",
    ],
    ending: "Dust slowly piled up on InSight's [[solar|solar panels]]. With too little power, it last contacted Earth on December 15, 2022, and NASA ended the mission on December 21, 2022.",
    mattersToday: "Knowing how Mars is built helps scientists understand how rocky planets, including Earth, form.",
    thinkAbout: "How can shaking ground tell you what's deep inside a planet?",
    legacy: "Its final posted message: 'My power's really low, so this may be the last image I can send.'",
    quiz: [
      { q: "What did InSight listen for?", options: ["Music", "Marsquakes", "Wind only"], answer: 1, explain: "It felt 1,319 quakes." },
      { q: "Why did InSight stop?", options: ["Dust covered its solar panels", "It drove off a cliff", "It ran out of fuel"], answer: 0, explain: "Less sunlight meant less power." },
    ],
    map: { x: 40, y: 72 },
    events: [
      { date: "2018-05-05", label: "InSight launches", kind: "launch" },
      { date: "2018-11-26", label: "InSight lands on Mars", kind: "landing" },
      { date: "2022-12-21", label: "InSight mission ends", kind: "end" },
    ],
    source: { label: "NASA Science: InSight", url: "https://science.nasa.gov/mission/insight/" },
  },
  {
    slug: "ingenuity",
    name: "Ingenuity Mars Helicopter",
    zone: "mars",
    status: "complete",
    image: ingenuityImg,
    imageAlt: "Illustration of a small helicopter flying over red Mars dunes",
    launch: "July 30, 2020 (with Perseverance)",
    location: "Jezero Crater, Mars",
    letter: "People said flying on Mars might be impossible, because the air is so thin. I was planned for 5 test flights. I flew 72 times!",
    mission: "Test whether a helicopter could fly in Mars's thin [[atmosphere|atmosphere]].",
    discoveries: [
      "On April 19, 2021, made the first powered, controlled flight on another planet.",
      "Scouted the path ahead for the Perseverance [[rover|rover]].",
      "Proved that aircraft can explore other worlds.",
    ],
    ending: "On its 72nd flight in January 2024, a rotor blade was damaged. It can no longer fly, and NASA ended the mission on January 25, 2024.",
    mattersToday: "NASA is studying bigger Mars helicopters, and the Dragonfly mission will fly on Saturn's moon Titan.",
    thinkAbout: "Why is it harder to fly where the air is thin?",
    legacy: "A small piece of fabric from the Wright brothers' 1903 airplane rides on board.",
    quiz: [
      { q: "How many times did Ingenuity fly?", options: ["5", "72", "1"], answer: 1, explain: "It was planned for 5 and flew 72." },
      { q: "Why is flying on Mars hard?", options: ["The air is very thin", "There is too much rain", "It's too hot"], answer: 0, explain: "Thin air gives the rotors less to push on." },
    ],
    map: { x: 82, y: 32 },
    events: [
      { date: "2021-02-18", label: "Perseverance lands carrying Ingenuity", kind: "landing" },
      { date: "2021-04-19", label: "First flight on another planet", kind: "milestone" },
      { date: "2024-01-25", label: "Ingenuity mission ends", kind: "end" },
    ],
    source: { label: "NASA Science: Ingenuity", url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" },
  },
  {
    slug: "voyager-1",
    name: "Voyager 1",
    zone: "deep",
    status: "talking",
    image: voyagerImg,
    imageAlt: "Illustration of the Voyager probe with a white dish antenna and golden record",
    launch: "September 5, 1977",
    location: "Interstellar space, the farthest human-made object",
    letter: "I'm the farthest traveler humans ever made. I left the Sun's bubble in 2012. I carry a golden record with sounds and pictures of Earth, just in case someone finds me.",
    mission: "Fly past Jupiter and Saturn, then keep going into deep space.",
    discoveries: [
      "Found active volcanoes on Jupiter's moon Io, the first seen beyond Earth.",
      "Studied Saturn's rings and its moon Titan.",
      "In 1990 took the 'Pale Blue Dot' photo, showing Earth as a tiny speck.",
      "In August 2012 became the first spacecraft to reach [[interstellar|interstellar space]].",
    ],
    ending: "It hasn't ended! Voyager 1 still sends [[radio|radio signals]]. Its [[rtg|nuclear battery]] gets weaker each year, so instruments are slowly turned off. Check NASA for the latest status.",
    mattersToday: "Voyager is our only direct sample of what lies between the stars.",
    thinkAbout: "If you could put one sound on the Golden Record, what would it be?",
    legacy: "Carries the Golden Record: greetings in 55 languages, music and sounds of Earth.",
    quiz: [
      { q: "What did Voyager 1 discover on Io?", options: ["Volcanoes", "Oceans", "Trees"], answer: 0, explain: "Active volcanoes, the first found beyond Earth." },
      { q: "What is the Golden Record?", options: ["A trophy", "A disc with sounds and images of Earth", "A gold engine"], answer: 1, explain: "A message for anyone who finds it." },
    ],
    map: { x: 80, y: 25 },
    events: [
      { date: "1977-09-05", label: "Voyager 1 launches", kind: "launch" },
      { date: "1990-02-14", label: "Voyager 1 takes the 'Pale Blue Dot' photo", kind: "milestone" },
      { date: "2012-08-25", label: "Voyager 1 enters interstellar space", kind: "milestone" },
    ],
    source: { label: "NASA JPL: Voyager", url: "https://science.nasa.gov/mission/voyager/" },
  },
  {
    slug: "voyager-2",
    name: "Voyager 2",
    zone: "deep",
    status: "talking",
    image: voyagerImg,
    imageAlt: "Illustration of the Voyager probe in starry space",
    launch: "August 20, 1977",
    location: "Interstellar space",
    letter: "I launched before my twin, Voyager 1. I'm the only spacecraft ever to visit Uranus and Neptune. Four giant planets in one trip!",
    mission: "Tour the giant outer planets: Jupiter, Saturn, Uranus and Neptune.",
    discoveries: [
      "The only spacecraft to visit Uranus (1986) and Neptune (1989).",
      "Discovered new moons and rings around these ice giants.",
      "Reached [[interstellar|interstellar space]] in November 2018.",
    ],
    ending: "It hasn't ended! Voyager 2 still sends data home, while engineers carefully save power. Check NASA for the latest status.",
    mattersToday: "Almost everything we know up close about Uranus and Neptune comes from Voyager 2. Scientists hope to send new missions there.",
    thinkAbout: "Voyager 2 used each planet's gravity to swing to the next one. How is that like a slingshot?",
    legacy: "Also carries a copy of the Golden Record.",
    quiz: [
      { q: "Which planets did only Voyager 2 visit?", options: ["Mars and Venus", "Uranus and Neptune", "Mercury and Pluto"], answer: 1, explain: "No other spacecraft has visited them." },
      { q: "When did it reach interstellar space?", options: ["2018", "1977", "2030"], answer: 0, explain: "November 2018." },
    ],
    map: { x: 55, y: 60 },
    events: [
      { date: "1977-08-20", label: "Voyager 2 launches", kind: "launch" },
      { date: "1989-08-25", label: "Voyager 2 flies past Neptune", kind: "milestone" },
      { date: "2018-11-05", label: "Voyager 2 enters interstellar space", kind: "milestone" },
    ],
    source: { label: "NASA JPL: Voyager", url: "https://science.nasa.gov/mission/voyager/" },
  },
  {
    slug: "pioneer-10",
    name: "Pioneer 10",
    zone: "deep",
    status: "traveling",
    image: pioneerImg,
    imageAlt: "Illustration of the Pioneer 10 probe flying past Jupiter",
    launch: "March 2, 1972",
    location: "Heading toward the star Aldebaran",
    letter: "I was the first to cross the asteroid belt and the first to visit Jupiter. I stopped talking in 2003, but I'm still flying. I carry a picture plaque that shows who sent me.",
    mission: "Be the first spacecraft to fly through the asteroid belt and past Jupiter.",
    discoveries: [
      "Showed the asteroid belt was safe to cross.",
      "Made the first close-up [[flyby|flyby]] of Jupiter in December 1973.",
      "Measured Jupiter's strong radiation belts.",
    ],
    ending: "Its [[rtg|nuclear battery]] slowly faded. NASA received its last, very weak signal on January 23, 2003. It is silent but still traveling.",
    mattersToday: "Pioneer 10 paved the way for Voyager, Galileo, Juno and every spacecraft that has visited Jupiter since.",
    thinkAbout: "Pioneer's plaque uses pictures, not words. Why might pictures be better for aliens?",
    legacy: "Last signal: January 23, 2003. It will take about 2 million years to reach Aldebaran.",
    quiz: [
      { q: "Pioneer 10 was the first to visit which planet?", options: ["Jupiter", "Neptune", "Mars"], answer: 0, explain: "It flew by Jupiter in December 1973." },
      { q: "What does its plaque show?", options: ["A map and drawings of people", "A song", "A phone number"], answer: 0, explain: "It shows humans and where Earth is." },
    ],
    map: { x: 25, y: 45 },
    events: [
      { date: "1972-03-02", label: "Pioneer 10 launches", kind: "launch" },
      { date: "1973-12-03", label: "Pioneer 10 flies past Jupiter", kind: "milestone" },
      { date: "2003-01-23", label: "Pioneer 10's last signal", kind: "end" },
    ],
    source: { label: "NASA Science: Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/" },
  },
];

export const getHardware = (slug: string) => hardware.find((h) => h.slug === slug);
