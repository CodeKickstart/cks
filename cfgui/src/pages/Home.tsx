import { QueryClient, QueryClientProvider } from "react-query";
import _Interview from "../components/Interview/ui-common/_Interview";

const queryClient = new QueryClient();

const Home = () => {
  // Sample data for property Attributes

  return (
    <div className='flex items-center'>
      <QueryClientProvider client={queryClient}>
        <_Interview
          baseUrl={"http://localhost:3502"}
          path={"/api/queryDataSrc"}
          libAddress={"repo"}
          relProdPath={"prod1"}
        />
      </QueryClientProvider>
    </div>
  );
};

export default Home;
