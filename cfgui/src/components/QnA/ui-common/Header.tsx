export default function Header() {
  return (
    <ul id='idFooter' className='flex bg-gray-800 p-4'>
      <li className='mr-6'>
        <a href='/' className='text-white'>
          Home
        </a>
      </li>
      <li className='ml-auto'>
        <a href='/contact-us' className='text-white mr-4'>
          Contact
        </a>
        <a href='/about' className='text-white'>
          About
        </a>
      </li>
    </ul>
  );
}
