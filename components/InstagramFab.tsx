export default function InstagramFab() {
  return (
    <a
      href="https://www.instagram.com/_rest.and.rise/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="레스트앤라이즈 인스타그램 (@_rest.and.rise)"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-white/90 p-3 shadow-lg ring-1 ring-forest/15 backdrop-blur transition-all hover:pr-4 hover:shadow-xl"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold via-leaf to-forest text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-forest transition-all duration-300 group-hover:max-w-[9rem]">
        팔로우 · DM
      </span>
    </a>
  );
}
