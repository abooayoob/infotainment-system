import { useParams } from "react-router-dom";

export function NextPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Next Page {id}</h1>
      <p>
        Edit <code>src/NextPage.tsx</code> and save to test HMR
      </p>
    </div>
  );
}
