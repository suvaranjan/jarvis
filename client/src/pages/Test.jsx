import { useState, useEffect } from "react";
import { useAxios } from "../hooks/useAxios";

function Test() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authorizedAxios } = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authorizedAxios.get("/get-imagekit-token");
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorizedAxios]); // optional: add to deps

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Test Component</h1>
      <p>Response from server:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Test;
