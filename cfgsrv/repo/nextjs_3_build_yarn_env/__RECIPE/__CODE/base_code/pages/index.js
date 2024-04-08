import { Fragment } from 'react';
import Head from 'next/head';

//import FeaturedPosts from '../components/home-page/featured-posts';
import Hero from '../components/home-page/hero';
//import { getFeaturedPosts } from '../lib/posts-util';

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>Code Recipes</title>
        <meta
          name='description'
          content='Starter Recipes for Code'
        />
      </Head>
      <Hero />
    </Fragment>
  );
}

//export function getStaticProps() {
//  const featuredPosts = getFeaturedPosts();
//
//  return {
//    props: {
//      posts: featuredPosts,
//    },
//  };
//}

export default HomePage;
