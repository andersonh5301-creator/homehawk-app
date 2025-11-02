export default function Page() {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Welcome to HomeHawk</h1>
      <p>Subscription-based home check-ins and vendor coordination across lake regions.</p>
      <div className="flex gap-3">
        <a className="underline text-blue-600" href="/signin">Sign in</a>
        <a className="underline text-blue-600" href="/plans">Plans</a>
        <a className="underline text-blue-600" href="/dashboard">Dashboard</a>
      </div>
    </div>
  );
}
