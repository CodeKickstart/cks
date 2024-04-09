import { QueryClient, QueryClientProvider } from "react-query";
import _Interview from "../components/Interview/ui-common/_Interview";

const queryClient = new QueryClient();

const Home = () => {
  return (
    <div className='flex items-center h-full'>
      {" "}
      {/* Apply flex and full height */}
      <QueryClientProvider client={queryClient}>
        <div className='flex-grow'>
          {" "}
          {/* Apply flex-grow to allow stretching */}
          <_Interview
            baseUrl={"http://localhost:3502"}
            path={"/api/queryDataSrc"}
            libAddress={"repo"}
            relProdPath={"prod1"}
          />
        </div>
      </QueryClientProvider>
    </div>
  );
};

export default Home;
