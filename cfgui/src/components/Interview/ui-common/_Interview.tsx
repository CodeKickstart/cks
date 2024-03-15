import { useMemo } from "react";
import { useQuery } from "react-query";
import QnA from "./_QnA";
import { valtioStore } from "../defs/types/ValtioTypes";
import { JsonObjectType } from "../../../shared/defs/types";

interface InterviewProps {
  baseUrl: string;
  path: string;
  libAddress: string;
  relProdPath: string;
}

const _Interview = ({
  baseUrl = "http://localhost:3502",
  path = "/api/queryDataSrc",
  libAddress,
  relProdPath,
}: InterviewProps) => {
  const queryParams = new URLSearchParams({
    libAddress: libAddress,
    relProdPath: relProdPath,
  }).toString();

  const apiUrl = `${baseUrl}${path}?${queryParams}`;
  const urlInfo = {
    baseUrl,
    path,
    queryParams,
  };
  valtioStore.urlInfo = urlInfo;
  console.log(apiUrl);

  const fetchData = useMemo(
    () => async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    []
  );

  const { data, isLoading, isError } = useQuery("data", () =>
    fetchData(apiUrl)
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (typeof data === "string") {
    return <div>`Data Error:: {data}`</div>;
  }

  if (isError || !data) {
    return <div>Network Error fetching data from server</div>;
  }

  valtioStore.queryContext = data as JsonObjectType;

  return (
    <div className='flex-col h-full w-full'>
      <QnA></QnA>
      <div
        id='idContexts'
        className='flex-auto flex flex-col md:flex-row md:space-x-4 md:m-4'></div>
    </div>
  );
};

export default _Interview;
