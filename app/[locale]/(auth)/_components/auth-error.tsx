export function AuthError({ message }: { message: string }) {
  return <p className="text-accent-red text-sm">{message}</p>;
}
