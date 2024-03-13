import React from "react";

const About: React.FC = () => {
  return (
    <div className='flex flex-col h-screen'>
      <header className='bg-gray-800 text-white py-4 fixed top-0 w-full z-10'>
        Header
      </header>
      <main className='flex-1 overflow-y-auto pt-16 pb-16'>
        <div className='container mx-auto px-4 py-8'>
          {/* Add your scrollable content here */}
          <div className='prose lg:prose-xl'>
            {/* Example long text */}
            {Array.from({ length: 50 }, (_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                faucibus metus a nibh consequat, ut condimentum purus fermentum.
                Donec nec justo ac libero eleifend accumsan ut a tellus. Nam
                ultricies, ex ut laoreet fermentum, elit felis feugiat nunc, nec
                cursus metus elit nec lacus. Nullam id odio nec urna maximus
                maximus. Mauris tincidunt sem ac lorem suscipit, eu lacinia arcu
                tempus. Cras quis lectus nisl. Sed sed odio ligula. Suspendisse
                potenti. Donec sit amet erat vitae odio ullamcorper venenatis
                nec nec odio. Donec gravida nisl id posuere pharetra. Quisque
                eget orci sed nulla ornare condimentum in ut lorem.
              </p>
            ))}
          </div>
        </div>
      </main>
      <footer className='bg-gray-800 text-white py-4 fixed bottom-0 w-full z-10'>
        Footer
      </footer>
    </div>
  );
};

export default About;
