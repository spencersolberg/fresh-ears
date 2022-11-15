import { Head } from "$fresh/runtime.ts";
import Game from "../islands/Game.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh Ears</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <Game />
      </div>
    </>
  );
}
