import { Head } from "$fresh/runtime.ts";
import Game from "../islands/Game.tsx";
import Footer from "../components/Footer.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh Ears</title>
        <style>
          {`
            body {
              min-height: 100%;
            }
            html {
              min-height: 100%;
            }
          `}
        </style>
      </Head>
      <main class="p-4 mx-auto max-w-screen-md">
        <Game />
      </main>
      <Footer />
    </>
  );
}
