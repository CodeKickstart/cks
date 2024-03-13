export default function Header() {
  return (
    <header className='bg-gray-800 text-white py-4 fixed top-0 w-full z-10 flex justify-between items-center'>
      <div className='mr-6'>
        <a href='/' className='text-white m-4'>
          Home
        </a>
      </div>
      <div className='ml-auto'>
        <a href='/contact-us' className='text-white m-4'>
          Contact
        </a>
        <a href='/about-us' className='text-white m-4'>
          About
        </a>
      </div>
    </header>
  );
}
