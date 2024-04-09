import { Fragment } from 'react';
import Head from 'next/head';

import {{Name}} from '../components/{{name}}/{{name}}-comp';

function {{Name}}Page() {
  return (
    <Fragment>
      <Head>
        <title>{{Name}}</title>
        <meta name='{{name}} us' content='this is a simple {{name}} page' />
      </Head>
      <{{Name}}/>
    </Fragment>
  );
}

export default {{Name}}Page;
