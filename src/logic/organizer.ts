import { Competition } from "@wca/helpers";

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

interface Dictionary<T> {
  [Key: string]: T;
}

const fullNames: Dictionary<string> = {
  "2x2x2": "222",
  "3x3x3": "333",
  "4x4x4": "444",
  "5x5x5": "555",
  "6x6x6": "666",
  "7x7x7": "777",
  "3x3x3 Blindfolded": "333bf",
  "3x3x3 Fewest Moves": "333fm",
  "3x3x3 One-Handed": "333oh",
  Clock: "clock",
  Megaminx: "minx",
  Pyraminx: "pyram",
  Skewb: "skewb",
  "Square-1": "sq1",
  "4x4x4 Blindfolded": "444bf",
  "5x5x5 Blindfolded": "555bf",
  "3x3x3 Multiple Blindfolded": "333mbf",
};

const eventNames: Dictionary<string> = {
  "222": "2x2",
  "333": "3x3",
  "444": "4x4",
  "555": "5x5",
  "666": "6x6",
  "777": "7x7",
  "333bf": "3BLD",
  "333fm": "FMC",
  "333oh": "OH",
  clock: "Clock",
  minx: "Mega",
  pyram: "Pyra",
  skewb: "Skewb",
  sq1: "SQ-1",
  "444bf": "4BLD",
  "555bf": "5BLD",
  "333mbf": "MBLD",
};

interface Event {
  event: string;
  roundId: number;
}

interface Password {
  password: string;
  event: string;
  round: number;
}

function parseEventId(id: string): Event | null {
  if (!id) return null;
  if (id.length < 3) return null;
  const [event, round] = id.split("-");

  if (!Object.keys(eventNames).includes(event)) return null;
  const roundId = parseInt(round.substring(1)) ?? null;
  if (roundId == null || isNaN(roundId)) return null;

  return { event, roundId };
}

function parsePassword(password: string): Password | undefined {
  const eventEnd = password.indexOf(" Round");
  if (eventEnd === -1) return undefined;

  const event = password.substring(0, eventEnd);
  const round = password.substring(eventEnd + 7, eventEnd + 8);
  const eventId = fullNames[event];
  const shortEventName = eventNames[eventId];
  const roundId = parseInt(round);

  if (!eventId || !shortEventName || !roundId) return undefined;

  const passwordString =
    shortEventName +
    " R" +
    password
      .substring(eventEnd + 7)
      .replace(" Scramble Set ", " ")
      .replace(" Attempt ", "-A");

  return {
    password: passwordString,
    event: eventId,
    round: roundId,
  };
}

async function getWCIF(
  wasDropped: boolean,
  competitionId: string
): Promise<Competition | undefined> {
  console.log(wasDropped, competitionId)
  try {
    const apiUrl = `https://www.worldcubeassociation.org/api/v0/competitions/${competitionId}/wcif/public`;
    
    const response = await fetch(apiUrl, {});

    if (!response.ok) {
      console.log(response);
      return undefined;
    }

    const wcif = (await response.json()) as Competition | undefined;
    if (!checkWCIF(wcif)) return undefined;
    return wcif;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

function checkWCIF(wcif: Competition | undefined): boolean {
  if (!wcif) return false;

  if (!wcif.schedule || !wcif.events) return false;

  return true;
}

export async function searchForCompId(query: string): Promise<string | undefined> {
  const apiUrl = `https://www.worldcubeassociation.org/api/v0/search/competitions/?q=${query}`;
  const response = await fetch(apiUrl, {});

  if (!response.ok) {
    return undefined;
  }

  const json = await response.json() as { result: { id: string, name: string }[] };
  const match = json.result.find(c => c.id == query || c.name == query);
  return match?.id ?? json?.result[0]?.id;
}

export async function sortPasswords(
  wasDropped: boolean,
  competitionId: string,
  passwords: string
): Promise<Result<string>> {
  const wcif = await getWCIF(wasDropped, competitionId);

  if (!wcif) {
    return {
      ok: false,
      error: new Error("Error fetching competition details"),
    };
  }

  const activities = wcif.schedule.venues
    ?.flatMap((venue) => venue.rooms)
    .flatMap((room) => room.activities);

  const sorted = activities
    .sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime))
    .map((activity) => {
      return parseEventId(activity.activityCode);
    })
    .filter((event) => event) as Event[];

  const parsedPasswords = passwords
    .split("\n")
    .filter((p) => p)
    .map((password) => {
      return parsePassword(password);
    })
    .filter((password): password is Password => !!password);

  const sortedPasswords = parsedPasswords
    .sort((a: Password, b: Password) => {
      const firstIdx = sorted.findIndex(
        (event) => event.event === a.event && event.roundId === a.round
      );
      const secondIdx = sorted.findIndex(
        (event) => event.event === b.event && event.roundId === b.round
      );

      return firstIdx - secondIdx;
    })
    .map((password) => password.password);

  return {
    ok: true,
    value: sortedPasswords.join("\n"),
  };
}
