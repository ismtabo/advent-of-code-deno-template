export async function submitAnswer(
  day: number,
  part: number,
  answer: string,
  sessionCookie: string,
) {
  const url = `https://adventofcode.com/2023/day/${day}/answer`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Cookie": `session=${sessionCookie}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `level=${part}&answer=${answer}`,
  });

  if (response.status !== 200) {
    throw new Error(
      `Failed to post results for day ${day} part ${part}: ${response.statusText}`,
    );
  }

  const result = await response.text();
  return result;
}
