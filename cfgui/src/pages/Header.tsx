export default function Header() {
  return (
    <header className='bg-gray-800 text-white py-4 fixed top-0 w-full z-10'>
      <div className='ml-4'>Logo</div>
      <nav className='mr-4'>
        <ul className='flex'>
          <li className='mx-2'>About</li>
          <li className='mx-2'>Contact</li>
        </ul>
      </nav>
      {/* <ul>
        <li className='mr-6'>
          <a href='/' className='text-white'>
            Home
          </a>
        </li>
        <li className='ml-auto'>
          <a href='/contact-us' className='text-white mr-4'>
            Contact
          </a>
          <a href='/about-us' className='text-white'>
            About
          </a>
        </li>
      </ul> */}
    </header>
  );
}
