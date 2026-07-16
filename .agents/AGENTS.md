# Workspace Customization Rules

## Routing Rules
1. **Never** use `window.location.href`, `window.location.assign`, or standard HTML `<a>` tags for internal navigation within the Next.js app.
2. **Always** use Next.js `useRouter().push()` from `next/navigation` for programmatic routing, or Next.js `<Link href="...">` for declarative routing.
3. **Reason:** The app utilizes Framer Motion `<AnimatePresence>` for its Splash Screen and page transitions. Hard navigations (like `window.location.href`) bypass the Next.js router, instantly destroying the DOM and preventing exit animations from playing. Client-side routing is strictly required to maintain the splash screen sequence.

## Styling Rules
1. **No glassmorphism.** Never use `backdrop-blur`, `bg-white/XX` (semi-transparent backgrounds), `bg-black/XX` for overlays, or any other frosted-glass effect anywhere in this project.
2. **Always use solid colors.** Backgrounds must be fully opaque (e.g., `bg-white`, `bg-[#F8F6F0]`, `bg-[#2B4C3B]`). Modal/drawer overlays must use a solid dark color (e.g., `bg-black/75` is acceptable as a *dark overlay* but no `backdrop-blur` on top of it).
3. **Reason:** The project's design language is earthy, solid, and grounded — not translucent. Glassmorphism conflicts with this aesthetic.
