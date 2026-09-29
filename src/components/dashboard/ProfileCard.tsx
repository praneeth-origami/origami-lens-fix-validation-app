/**
 * TEST CASE OL-002 — see TEST-CASES.md.
 *
 * The avatar <img> below is intentionally missing an `alt` attribute, so
 * assistive technology and Origami Lens's DOM scan cannot determine what
 * the image represents. A plain <img> is used deliberately instead of
 * next/image — next/image's `alt` prop is required by its TypeScript
 * types, which would make this exact bug impossible to express. `npm run
 * lint` reports one *unrelated* expected warning here
 * (@next/next/no-img-element, a performance suggestion) — that is not the
 * bug this test case is about and does not fail the lint script.
 */
export function ProfileCard() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-sm font-medium text-slate-200">Your profile</h2>
      <div className="mt-4 flex items-center gap-4">
        {/* ORIGAMI-LENS-TEST: ACCESSIBILITY-002 — image has no alt text */}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src="/avatar-placeholder.svg" className="h-14 w-14 rounded-full border border-slate-800 bg-slate-900" width={56} height={56} alt="User profile picture" />
        <div>
          <p className="font-medium text-white">Dana Whitfield</p>
          <p className="text-sm text-slate-400">Product Engineer · Origami Lens</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">Workspace</dt>
          <dd className="text-slate-200">Origami Lens Test</dd>
        </div>
        <div>
          <dt className="text-slate-500">Role</dt>
          <dd className="text-slate-200">Admin</dd>
        </div>
      </dl>
      <button type="button" className="mt-4 w-full rounded-lg border border-slate-700 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900">
        Edit profile
      </button>
    </div>
  );
}
