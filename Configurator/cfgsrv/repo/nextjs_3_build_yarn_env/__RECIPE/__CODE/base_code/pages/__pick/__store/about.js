import { Fragment } from 'react';
import Head from 'next/head';

//import ContactForm from '../components/contact/contact-form';
import About from '../components/about/about-comp';

function AboutPage() {
  return (
    <Fragment>
      <Head>
        <title>About</title>
        <meta name='about us' content='this is a simple about page' />
      </Head>
      <About/>
    </Fragment>
  );
}

export default AboutPage;
