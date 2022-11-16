export default function Footer() {
  return (
    <footer class="bg-black grid grid-cols-2 bottom-0 absolute w-full">
      <div>
        <div class="text-4xl font-medium text-white ml-4">
          Fresh Ears
        </div>
        <div class="text-white text-sm py-2 ml-4">
          © 2022 Spencer Solberg
        </div>
      </div>
      <div>
        <div class="text-2xl text-white mr-4 text-right">
          <a
            href="https://github.com/spencersolberg/fresh-ears"
            target="_blank"
            class="hover:underline"
          >
            GitHub
          </a>
        </div>
        <div class="text-2xl text-white mr-4 text-right">
          <a
            href="https://spencersolberg.com"
            target="_blank"
            class="hover:underline"
          >
            spencersolberg
          </a>
        </div>
      </div>
    </footer>
  );
}
