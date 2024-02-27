import {
  fnGetCurrentCursor,
  fnIsItTheLastQuestion,
} from "../../../cfgui/src/components/interview/QnA/state-mgt/cursor/cursor";
import { fnSplitCursor } from "../../../cfgui/src/components/interview/QnA/misc/strings";
import {
  fnGetQueryObject,
  fnSetQueryAttribute,
} from "../../../cfgui/src/components/interview/QnA/state-mgt/dataAccess/loLevelAccess";
import { KEY_VAL } from "../../../cfgui/src/shared/defs/constants";

interface Props {
  onCancel: () => void;
  onResponse: () => void;
}

const Text: React.FC<Props> = ({ onCancel, onResponse }: Props) => {
  const [answer, setAnswer] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [promptStr, setPromptStr] = useState<string>("");
  const [isAnswerEmpty, setIsAnswerEmpty] = useState<boolean>(true); // Track if the answer is empty
  const [sidCursor, setSidCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state
  const [nextButtonLabel, setNextButtonLabel] = useState<string>("Next");

  useEffect(() => {
    const cursor = fnGetCurrentCursor();
    if (!cursor) {
      return;
    }

    const isThisTheLastQuestion = fnIsItTheLastQuestion();
    // console.log(`isThisTheLastQuestion: ${isThisTheLastQuestion}`);
    if (isThisTheLastQuestion) {
      setNextButtonLabel("Finish");
    }

    const { sidCursor: sidCursorFromNavigation } = fnSplitCursor(cursor);
    setSidCursor(sidCursorFromNavigation);
    const { error, queryObject } = fnGetQueryObject(sidCursorFromNavigation);
    if (error) {
      console.log(error);
      return;
    }
    if (queryObject) {
      const { prompt, defval } = queryObject;

      if (defval) {
        setAnswer(defval as string);
      } else {
        if (prompt) {
          setPromptStr(prompt as string);
        }
      }
    }

    setIsLoading(false); // Set loading state to false after fetching data
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    // Check if the answer is empty
    setIsAnswerEmpty(answer.trim() === "");
  }, [answer]);

  const handleNext = () => {
    fnSetQueryAttribute(sidCursor, KEY_VAL, answer);
    // valtioStore.answers.push(answer);
    setAnswer("");
    onResponse();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  // Render loading state
  if (isLoading) {
    return <div></div>;
  }

  // Render UI
  return (
    <div className='p-4 border rounded-md shadow-md'>
      <h3 className='text-xl font-bold mb-2'>Text</h3>
      <div className='text-lg italic mb-2'>{promptStr}</div>
      <input
        ref={inputRef}
        type='text'
        className='border rounded-md px-2 py-1 mb-2 w-full'
        value={answer}
        placeholder='Enter your response here'
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-md mr-2 ${
            isAnswerEmpty ? "opacity-50 cursor-not-allowed" : ""
          }`} // Apply opacity and disabled styles when the answer is empty
          onClick={handleNext}
          disabled={isAnswerEmpty}>
          {" "}
          {/* Disable the button if the answer is empty */}
          {nextButtonLabel}
        </button>
        <button
          className='bg-gray-500 text-white px-4 py-2 rounded-md mr-2'
          onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Text;
function useState<T>(arg0: string): [any, any] {
  throw new Error("Function not implemented.");
}

function useRef<T>(arg0: null) {
  throw new Error("Function not implemented.");
}

function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
