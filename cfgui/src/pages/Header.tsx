export default function Header() {
  return (
    <header className='bg-gray-800 text-white py-4 fixed top-0 w-full z-10 flex justify-between items-center'>
      <div className='flex items-center'>
        <nav>
          <ul className='flex'>
            <li className='m-4'>
              <a href='#'>Home</a>
            </li>
          </ul>
        </nav>
      </div>
      {/* About and Contact */}
      <nav>
        <ul className='flex'>
          <li className='m-4'>
            <a href='#'>About</a>
          </li>
          <li className='m-4'>
            <a href='#'>Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
