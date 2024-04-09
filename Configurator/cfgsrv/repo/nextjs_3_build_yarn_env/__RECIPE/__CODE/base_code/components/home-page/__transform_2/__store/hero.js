{%- set name_1 = val(tokens, "base.id_name1") -%}
{%- set name_2 = val(tokens, "base.id_name2") -%}

import Image from 'next/image';

import classes from './hero.module.css';

function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src='/images/site/{{name_1}}.jpg'
          alt='An image showing {{name_1}}'
          width={300}
          height={300}
        />
      </div>
      <h1>Hi, I'm  {{ name_1 }}</h1>
      <p>
My friend, {{ name_2 }}, and I are building a website for developers to create software projects that can be crafted from various software components needing integration across technologies and languages.
Here the developer can opt for basic features to get a head start on their project.      </p>
    </section>
  );
}

export default Hero;
