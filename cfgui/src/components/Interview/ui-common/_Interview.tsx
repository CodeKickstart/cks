import { useState, useEffect, useMemo } from "react";
import QueryContext from "./QueryContext";

import ResponseContext from "./ResponseContext";
import { useQuery } from "react-query";
import QnA from "../ui-ops/_QnA";
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
  const [contextsHeight, setContextsHeight] = useState("auto");

  const queryParams = new URLSearchParams({
    libAddress: libAddress,
    relProdPath: relProdPath,
  }).toString();

  const apiUrl = `${baseUrl}${path}?${queryParams}`;
  console.log(apiUrl);

  const handleResize = () => {
    const windowHeight = document.documentElement.clientHeight; // window.screen.height;
    const headerHeight = fnGetHeight("idHeader");
    const footerHeight = fnGetHeight("idFooter");
    const interviewHeight = fnGetHeight("idInterview");

    let bufferHeight = 320;
    if (window.innerWidth < 768) bufferHeight = bufferHeight - 32;

    const remainingHeight =
      windowHeight -
      headerHeight -
      footerHeight -
      interviewHeight -
      bufferHeight;
    const contextsHeight = `${remainingHeight}px`;
    setContextsHeight(contextsHeight);

    function fnGetHeight(id: string) {
      const idHeader = document.getElementById(id);
      const headerHeight = idHeader ? idHeader.clientHeight : 0;
      return headerHeight;
    }
  };

  const fetchData = useMemo(
    () => async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    [] // No dependencies, so it will only be created once
  );

  useEffect(() => {
    // Set initial height
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data, isLoading, isError } = useQuery("data", () =>
    fetchData(apiUrl)
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error fetching data</div>;
  }

  valtioStore.queryContext = data as JsonObjectType;

  return (
    <div className='flex-col h-full w-full'>
      <QnA></QnA>
      <div
        id='idContexts'
        className='flex-auto flex flex-col md:flex-row md:space-x-4 md:m-4'
        style={{ height: contextsHeight }}>
        <div className='m-2 border-black border md:border-black md:border md:flex-1 md:h-full overflow-y-auto'>
          <QueryContext examine={true} />
        </div>
        <div className='m-2 border-black border md:border-black md:border md:flex-1 md:h-full overflow-y-auto'>
          <ResponseContext examine={true} />
        </div>
      </div>
    </div>
  );
};

export default _Interview;
