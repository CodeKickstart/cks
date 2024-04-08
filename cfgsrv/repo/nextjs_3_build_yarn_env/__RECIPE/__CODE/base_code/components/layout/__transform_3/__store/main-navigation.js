import Link from 'next/link';

import Logo from './logo.js';
import classes from './main-navigation.module.css';

function MainNavigation() {
  return (
    <header className={classes.header}>
      <Link href='/'>
          <Logo />
      </Link>
      <nav>
        <ul>
{% for link in val(tokens, "base.id_var_pages")  %}
          <li>
            <Link href='/{{link}}'>{{link|capitalize}}</Link>
          </li>
{% endfor %}
{% for link in val(tokens, "base.id_fixed_pages")  %}
          <li>
            <Link href='/{{link}}'>{{link|capitalize}}</Link>
          </li>
{% endfor %}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
