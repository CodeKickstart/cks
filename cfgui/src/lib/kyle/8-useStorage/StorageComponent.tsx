import { useSessionStorage, useLocalStorage } from "./useStorage";

export default function StorageComponent() {
  const [name, setName, removeName] = useSessionStorage("name", "Brats");
  const [age, setAge, removeAge] = useLocalStorage("age", 26);

  return (
    <div className='container mx-auto mt-10'>
      <div className='bg-gray-200 p-4 rounded-lg shadow-md'>
        <div className='mb-4'>
          <span className='font-bold'>Name:</span> {name} -{" "}
          <span className='font-bold'>Age:</span> {age}
        </div>
        <div className='space-x-4'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => setName("John")}>
            Set Name
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => setAge(40)}>
            Set Age
          </button>
          <button
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            onClick={removeName}>
            Remove Name
          </button>
          <button
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            onClick={removeAge}>
            Remove Age
          </button>
        </div>
      </div>
    </div>
  );
}
