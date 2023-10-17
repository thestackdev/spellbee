import Spinner from "@/components/Spinner";
import GameIndex from "@/components/index";
import "./spellbee.module.css";

export default async function Home() {
  const data = await fetch(
    `https://www.nytimes.com/puzzles/spelling-bee?date=${Date.now()}`
  )
    .then((res) => res.text())
    .then((data) =>
      JSON.parse(
        data.slice(
          data.indexOf("gameData") + 11,
          data.indexOf("}}", data.indexOf("gameData")) + 2
        )
      )
    );

  if (!data) return <Spinner />;

  return <GameIndex data={data.yesterday} />;
}
